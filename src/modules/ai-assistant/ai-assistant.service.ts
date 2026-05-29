import { ulid } from "ulid";
import { getAiResponse, GropRoles } from "../../config/groq.js";
import { prisma } from "../../db/prisma.js";
import {
  AiRole,
  InventoryTransactionType,
} from "../../generated/prisma/enums.js";
import { farmService } from "../farm/farm.service.js";
import type { AskAssistantDto } from "./ai-assistant.schema.js";
import type { AiInteraction, Prisma } from "../../generated/prisma/client.js";
import { aiSystemPrompt } from "../../constants/ai-assistant.constant.js";
import { AiIntent } from "./ai-assistant.type.js";
import { detectIntentWithLLM } from "../../utils/intent-detection.js";

class AiAssistantService {
  public async askQuestion(
    farmId: string,
    ownerId: string,
    { content, conversationId }: AskAssistantDto,
  ): Promise<{
    conversationId: string;
    response: string;
  }> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const activeConversationId = conversationId ?? ulid();

    return prisma.$transaction(async (tx) => {
      await tx.aiInteraction.create({
        data: {
          farmId,
          userId: ownerId,
          conversationId: activeConversationId as string,
          role: AiRole.USER,
          message: content,
        },
      });

      const conversationHistory = await this.getConversationHistory(
        tx,
        farmId,
        activeConversationId as string,
      );

      const intent = await detectIntentWithLLM(content);

      const context = await this.buildContextByIntent(tx, farmId, intent);

      console.log(this.formatContext(intent, context));

      const messages = [
        {
          role: GropRoles.SYSTEM,
          content: aiSystemPrompt,
        },
        {
          role: GropRoles.SYSTEM,
          content: this.formatContext(intent, context),
        },
        ...this.mapToGroqMessages(conversationHistory),
      ];

      const response = await getAiResponse(messages);

      await prisma.aiInteraction.create({
        data: {
          farmId,
          userId: ownerId,
          conversationId: activeConversationId as string,
          role: AiRole.ASSISTANT,
          message: response,
        },
      });

      return { conversationId: activeConversationId as string, response };
    });
  }

  private async getConversationHistory(
    tx: Prisma.TransactionClient,
    farmId: string,
    conversationId: string,
  ) {
    return tx.aiInteraction.findMany({
      where: {
        farmId,
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 20,
    });
  }

  private mapToGroqMessages(history: AiInteraction[]) {
    return history.map((msg) => ({
      role: msg.role.toLowerCase() as GropRoles,
      content: msg.message,
    }));
  }

  private async buildFarmContext(tx: Prisma.TransactionClient, farmId: string) {
    const [inventory, flocks, expenses, sales] = await Promise.all([
      tx.inventoryItem.findMany({
        where: { farmId },
        select: {
          id: true,
          name: true,
          category: true,
          costPerUnit: true,
        },
      }),

      tx.flock.findMany({
        where: { farmId },
        select: {
          id: true,
          name: true,
          breed: true,
        },
      }),

      tx.expense.aggregate({
        where: {
          farmId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        _sum: {
          amount: true,
        },
      }),

      tx.sale.aggregate({
        where: {
          farmId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),
    ]);

    return {
      inventory,
      flocks,
      expensesLast30Days: expenses._sum.amount ?? 0,
      salesLast30Days: sales._sum.totalAmount ?? 0,
    };
  }

  private async buildContextByIntent(
    tx: Prisma.TransactionClient,
    farmId: string,
    intent: AiIntent,
  ) {
    switch (intent) {
      case AiIntent.INVENTORY:
        return this.buildInventoryContext(tx, farmId);

      case AiIntent.FLOCK:
        return this.buildFlockContext(tx, farmId);

      case AiIntent.FINANCE:
        return this.buildFinanceContext(tx, farmId);

      case AiIntent.HEALTH:
        return this.buildHealthContext(tx, farmId);

      default:
        return this.buildFarmContext(tx, farmId);
    }
  }

  private async buildFinanceContext(
    tx: Prisma.TransactionClient,
    farmId: string,
  ) {
    const [expenses, sales] = await Promise.all([
      tx.expense.aggregate({
        where: { farmId },
        _sum: { amount: true },
      }),
      tx.sale.aggregate({
        where: { farmId },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      expenses: expenses._sum.amount ?? 0,
      sales: sales._sum.totalAmount ?? 0,
      profit: (sales._sum.totalAmount ?? 0) - (expenses._sum.amount ?? 0),
    };
  }

  private async buildFlockContext(
    tx: Prisma.TransactionClient,
    farmId: string,
  ) {
    const flocks = await tx.flock.findMany({
      where: { farmId },
      select: {
        id: true,
        name: true,
        breed: true,
      },
    });

    const transactions = await tx.inventoryTransaction.findMany({
      where: {
        farmId,
        flockId: { not: null },
      },
      select: {
        flockId: true,
        type: true,
        quantity: true,
      },
    });

    const summary = new Map<
      string,
      {
        mortality: number;
        feedConsumed: number;
        eggsProduced: number;
      }
    >();

    for (const t of transactions) {
      if (!t.flockId) continue;

      if (!summary.has(t.flockId)) {
        summary.set(t.flockId, {
          mortality: 0,
          feedConsumed: 0,
          eggsProduced: 0,
        });
      }

      const s = summary.get(t.flockId)!;

      switch (t.type) {
        case InventoryTransactionType.LOSS:
          s.mortality += Math.abs(t.quantity);
          break;

        case InventoryTransactionType.CONSUMPTION:
          s.feedConsumed += Math.abs(t.quantity);
          break;

        case InventoryTransactionType.PRODUCTION:
          s.eggsProduced += t.quantity;
          break;
      }
    }

    return flocks.map((f) => ({
      flockId: f.id,
      name: f.name,
      breed: f.breed,
      mortality: summary.get(f.id)?.mortality ?? 0,
      feedConsumed: summary.get(f.id)?.feedConsumed ?? 0,
      eggsProduced: summary.get(f.id)?.eggsProduced ?? 0,
    }));
  }

  private async buildInventoryContext(
    tx: Prisma.TransactionClient,
    farmId: string,
  ) {
    return tx.inventoryItem.findMany({
      where: { farmId },
      select: {
        id: true,
        name: true,
        category: true,
        costPerUnit: true,
      },
    });
  }

  private async buildHealthContext(
    tx: Prisma.TransactionClient,
    farmId: string,
  ) {
    const healthRecords = await tx.healthRecord.findMany({
      where: {
        flock: {
          farmId,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // keep it tight
      select: {
        id: true,
        flockId: true,
        type: true,
        diagnosis: true,
        treatment: true,
        createdAt: true,
      },
    });

    const grouped = healthRecords.reduce<Record<string, typeof healthRecords>>(
      (acc, record) => {
        const flockId = record.flockId;

        acc[flockId] ??= [];

        acc[flockId].push(record);

        return acc;
      },
      {},
    );

    return Object.entries(grouped).map(([flockId, records]) => ({
      flockId,
      recentCases: records.slice(0, 5),
      totalCases: records.length,
      commonIssues: this.extractCommonHealthIssues(records),
    }));
  }

  private formatContext(intent: AiIntent, context: any): string {
    switch (intent) {
      case AiIntent.INVENTORY:
        return `
INVENTORY CONTEXT

${context.length === 0 ? "No inventory records available." : ""}

${context
  .map(
    (item: any) => `
- Item: ${item.name}
  Category: ${item.category}
  Unit Cost: ${item.costPerUnit ?? "N/A"}
`,
  )
  .join("\n")}
`;

      case AiIntent.FLOCK:
        return `
FLOCK CONTEXT

${context.length === 0 ? "No flock data available." : ""}

${context
  .map(
    (flock: any) => `
- Flock: ${flock.name}
  Breed: ${flock.breed}
  Eggs Produced: ${flock.eggsProduced}
  Feed Consumed: ${flock.feedConsumed}
  Mortality: ${flock.mortality}
`,
  )
  .join("\n")}
`;

      case AiIntent.FINANCE:
        return `
FINANCIAL CONTEXT

- Total Expenses: ${context.expenses}
- Total Sales: ${context.sales}
- Estimated Profit: ${context.profit}
`;

      case AiIntent.HEALTH:
        return `
HEALTH CONTEXT

${context.length === 0 ? "No health records available." : ""}

${context
  .map(
    (health: any) => `
- Flock ID: ${health.flockId}
  Total Cases: ${health.totalCases}

  Common Issues:
  ${
    health.commonIssues.length > 0
      ? health.commonIssues
          .map((issue: any) => `- ${issue.issue} (${issue.count})`)
          .join("\n  ")
      : "- None recorded"
  }
`,
  )
  .join("\n")}
`;

      default:
        return `
GENERAL FARM CONTEXT

- Total Flocks: ${context.flockCount}
- Total Inventory Items: ${context.inventoryCount}
- Total Expenses: ${context.totalExpenses}
- Total Sales: ${context.totalSales}
- Estimated Profit:
  ${context.totalSales - context.totalExpenses}
`;
    }
  }

  private extractCommonHealthIssues(records: any[]) {
    const frequencyMap = new Map<string, number>();

    for (const record of records) {
      const key =
        record.diagnosis?.trim().toLowerCase() ??
        record.type?.trim().toLowerCase() ??
        "unknown";

      frequencyMap.set(key, (frequencyMap.get(key) ?? 0) + 1);
    }

    return Array.from(frequencyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue, count]) => ({
        issue,
        count,
      }));
  }
}

export const aiAssistantService = new AiAssistantService();

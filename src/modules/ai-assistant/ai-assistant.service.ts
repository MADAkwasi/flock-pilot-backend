import { ulid } from "ulid";
import { getAiResponse, GropRoles } from "../../config/groq.js";
import { prisma } from "../../db/prisma.js";
import { AiRole } from "../../generated/prisma/enums.js";
import { farmService } from "../farm/farm.service.js";
import type { AskAssistantDto } from "./ai-assistant.schema.js";
import type { AiInteraction, Prisma } from "../../generated/prisma/client.js";
import { aiSystemPrompt } from "../../constants/ai-assistant.constant.js";

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

    console.log(activeConversationId);

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

      const messages = [
        {
          role: GropRoles.SYSTEM,
          content: aiSystemPrompt,
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
}

export const aiAssistantService = new AiAssistantService();

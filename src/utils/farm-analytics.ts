import { prisma } from "../db/prisma.js";
import {
  InventoryCategory,
  InventoryTransactionType,
} from "../generated/prisma/enums.js";

class FarmAnalyticsService {
  public async getMortalityTrend(farmId: string) {
    const data = await prisma.mortalityRecord.findMany({
      where: { flock: { farmId } },
      select: {
        count: true,
        recordedAt: true,
      },
      orderBy: { recordedAt: "asc" },
    });

    return this.groupByDate(data, "count", "recordedAt");
  }

  public async getEggTrend(farmId: string) {
    const data = await prisma.inventoryTransaction.findMany({
      where: {
        farmId,
        type: "PRODUCTION", // or your egg-related type
      },
      select: {
        quantity: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return this.groupByDate(data, "quantity", "createdAt");
  }

  public async getInventoryStats(farmId: string) {
    const items = await prisma.inventoryItem.findMany({
      where: { farmId, isDeleted: false },
      select: {
        id: true,
        reorderLevel: true,
      },
    });

    const lowStockCount = await prisma.inventoryItem.count({
      where: {
        farmId,
        isDeleted: false,
        // assuming you compute stock elsewhere or via aggregation
      },
    });

    return {
      totalItems: items.length,
      lowStockCount,
    };
  }

  public async getExpenseStats(farmId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [thisMonth, lastMonth] = await Promise.all([
      prisma.expense.aggregate({
        where: {
          farmId,
          occurredAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),

      prisma.expense.aggregate({
        where: {
          farmId,
          occurredAt: {
            gte: startOfLastMonth,
            lt: startOfMonth,
          },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      thisMonth: thisMonth._sum.amount ?? 0,
      lastMonth: lastMonth._sum.amount ?? 0,
    };
  }

  public groupByDate<
    T extends Record<string, any>,
    F extends keyof T,
    D extends keyof T,
  >(data: T[], valueField: F, dateField: D) {
    const grouped = new Map<string, number>();

    for (const item of data) {
      const date = new Date(item[dateField]).toISOString().slice(0, 10);

      const value = Number(item[valueField] ?? 0);

      grouped.set(date, (grouped.get(date) ?? 0) + value);
    }

    return Array.from(grouped.entries()).map(([date, value]) => ({
      date,
      value,
    }));
  }

  public async getFeedTrend(farmId: string) {
    const data = await prisma.inventoryTransaction.findMany({
      where: {
        farmId,
        inventoryItem: {
          category: InventoryCategory.FEED,
        },
        type: InventoryTransactionType.CONSUMPTION,
      },
      select: {
        quantity: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return this.groupByDate(data, "quantity", "createdAt");
  }

  public async getExpenseTrend(farmId: string) {
    const data = await prisma.expense.findMany({
      where: {
        farmId,
      },
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return this.groupByDate(data, "amount", "createdAt");
  }

  public async getInventoryTrend(farmId: string) {
    const items = await prisma.inventoryItem.findMany({
      where: {
        farmId,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        reorderLevel: true,
        transactions: {
          select: {
            quantity: true,
          },
        },
      },
    });

    return items.map((item) => {
      const currentStock = item.transactions.reduce(
        (sum, tx) => sum + tx.quantity,
        0,
      );

      return {
        id: item.id,
        name: item.name,
        currentStock,
        reorderLevel: item.reorderLevel,
        lowStock: currentStock <= (item.reorderLevel ?? 0),
      };
    });
  }
}

export const farmAnalyticsService = new FarmAnalyticsService();

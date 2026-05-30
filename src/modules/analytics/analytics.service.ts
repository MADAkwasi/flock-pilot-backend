import { prisma } from "../../db/prisma.js";
import { farmAnalyticsService } from "../../utils/farm-analytics.js";
import { farmService } from "../farm/farm.service.js";

class AnalyticsService {
  public async getFarmOverview(farmId: string, ownerId: string) {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      flocks,
      inventoryItems,
      expenses,
      sales,
      mortalityRecords,
      eggRecords,
      inventoryTx,
    ] = await Promise.all([
      prisma.flock.findMany({
        where: { farmId },
        select: {
          id: true,
          currentCount: true,
          status: true,
        },
      }),

      prisma.inventoryItem.findMany({
        where: { farmId, isDeleted: false },
        select: {
          id: true,
          name: true,
          reorderLevel: true,
        },
      }),

      prisma.expense.aggregate({
        where: { farmId },
        _sum: { amount: true },
      }),

      prisma.sale.aggregate({
        where: { farmId },
        _sum: { totalAmount: true },
      }),

      prisma.mortalityRecord.findMany({
        where: {
          flock: { farmId },
          recordedAt: { gte: startOfMonth },
        },
        select: { count: true },
      }),

      prisma.eggProduction.findMany({
        where: {
          flock: { farmId },
          recordedAt: { gte: startOfMonth },
        },
        select: { count: true },
      }),

      prisma.inventoryTransaction.findMany({
        where: { farmId },
        select: {
          quantity: true,
          inventoryItem: {
            select: {
              id: true,
              name: true,
              reorderLevel: true,
            },
          },
        },
      }),
    ]);

    // -----------------------------
    // 🧠 DERIVED METRICS
    // -----------------------------

    const totalBirds = flocks.reduce((sum, f) => sum + f.currentCount, 0);

    const activeFlocks = flocks.filter((f) => f.status === "ACTIVE").length;

    const totalMortality = mortalityRecords.reduce(
      (sum, m) => sum + m.count,
      0,
    );

    const mortalityRate =
      totalBirds > 0 ? (totalMortality / totalBirds) * 100 : 0;

    const totalEggs = eggRecords.reduce((sum, e) => sum + e.count, 0);

    const totalExpenses = expenses._sum.amount ?? 0;
    const totalSales = sales._sum.totalAmount ?? 0;

    const profit = totalSales - totalExpenses;

    const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

    // -----------------------------
    // 📦 INVENTORY HEALTH
    // -----------------------------

    const stockMap = new Map<string, number>();

    for (const tx of inventoryTx) {
      const key = tx.inventoryItem.id;
      stockMap.set(key, (stockMap.get(key) ?? 0) + tx.quantity);
    }

    const lowStockItems = inventoryItems.filter((item) => {
      const stock = stockMap.get(item.id) ?? 0;

      return item.reorderLevel != null && stock <= item.reorderLevel;
    });

    // -----------------------------
    // 🚨 RISK ENGINE (lightweight)
    // -----------------------------

    const risks: string[] = [];

    if (mortalityRate > 5) {
      risks.push("High mortality rate detected");
    }

    if (lowStockItems.length > 0) {
      risks.push(`${lowStockItems.length} low stock items`);
    }

    if (profit < 0) {
      risks.push("Farm is operating at a loss");
    }

    if (totalEggs === 0 && activeFlocks > 0) {
      risks.push("Low or no egg production detected");
    }

    // -----------------------------
    // 📦 RESPONSE
    // -----------------------------

    return {
      summary: {
        totalBirds,
        activeFlocks,
        mortalityRate: Number(mortalityRate.toFixed(2)),
      },

      production: {
        totalEggs,
      },

      finance: {
        totalSales,
        totalExpenses,
        profit,
        profitMargin: Number(profitMargin.toFixed(2)),
      },

      inventory: {
        totalItems: inventoryItems.length,
        lowStockItems: lowStockItems.map((i) => ({
          id: i.id,
          name: i.name,
        })),
      },

      flockHealth: {
        totalMortality,
      },

      risks,
    };
  }

  public async getTrends(farmId: string, ownerId: string) {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const [mortality, eggs, feed, expenses] = await Promise.all([
      farmAnalyticsService.getMortalityTrend(farmId),
      farmAnalyticsService.getEggTrend(farmId),
      farmAnalyticsService.getFeedTrend(farmId),
      farmAnalyticsService.getExpenseTrend(farmId),
    ]);

    return {
      mortality,
      eggs,
      feed,
      expenses,
    };
  }

  
}

export const analyticsService = new AnalyticsService();

import { farmAnalyticsService } from "../farm-analytics.js";
import { InsightSeverity, type FarmInsight } from "./insight-engine.type.js";

class InsightEngineService {
  public async generateInsights(farmId: string): Promise<FarmInsight[]> {
    const insights: FarmInsight[] = [];

    const [mortalityTrend, eggTrend, inventoryStats, expenseStats] =
      await Promise.all([
        farmAnalyticsService.getMortalityTrend(farmId),
        farmAnalyticsService.getEggTrend(farmId),
        farmAnalyticsService.getInventoryStats(farmId),
        farmAnalyticsService.getExpenseStats(farmId),
      ]);

    insights.push(...this.detectMortalitySpike(mortalityTrend));
    insights.push(...this.detectProductionDrop(eggTrend));
    insights.push(...this.detectInventoryRisk(inventoryStats));
    insights.push(...this.detectExpenseSpike(expenseStats));

    return insights;
  }

  private detectMortalitySpike(trend: any[]): FarmInsight[] {
    if (trend.length < 2) return [];

    const latest = trend[trend.length - 1];
    const previous = trend[trend.length - 2];

    if (latest.count > previous.count * 1.5) {
      return [
        {
          id: "mortality_spike",
          type: "MORTALITY",
          severity: InsightSeverity.CRITICAL,
          message:
            "Mortality rate has increased significantly compared to previous period.",
          meta: { latest, previous },
        },
      ];
    }

    return [];
  }

  private detectProductionDrop(trend: any[]): FarmInsight[] {
    if (trend.length < 2) return [];

    const latest = trend[trend.length - 1];
    const previous = trend[trend.length - 2];

    if (latest.eggs < previous.eggs * 0.8) {
      return [
        {
          id: "egg_drop",
          type: "PRODUCTION",
          severity: InsightSeverity.WARNING,
          message: "Egg production has dropped significantly.",
          meta: { latest, previous },
        },
      ];
    }

    return [];
  }

  private detectInventoryRisk(stats: any): FarmInsight[] {
    if (stats.lowStockCount > 3) {
      return [
        {
          id: "inventory_risk",
          type: "INVENTORY",
          severity: InsightSeverity.WARNING,
          message: "Multiple inventory items are below reorder level.",
          meta: stats,
        },
      ];
    }

    return [];
  }

  private detectExpenseSpike(stats: any): FarmInsight[] {
    if (stats.thisMonth > stats.lastMonth * 1.3) {
      return [
        {
          id: "expense_spike",
          type: "FINANCE",
          severity: InsightSeverity.WARNING,
          message:
            "Expenses have increased significantly compared to last month.",
          meta: stats,
        },
      ];
    }

    return [];
  }
}

export const insightEngineService = new InsightEngineService();

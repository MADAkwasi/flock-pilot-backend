import { farmAnalyticsService } from "../farm-analytics.js";
import {
  PredictionSeverity,
  type FarmPrediction,
} from "./prediction-engine.type.js";

class PredictionEngineService {
  public async generatePredictions(farmId: string) {
    const [mortalityTrend, eggTrend, feedTrend, expenseTrend, inventoryTrend] =
      await Promise.all([
        farmAnalyticsService.getMortalityTrend(farmId),
        farmAnalyticsService.getEggTrend(farmId),
        farmAnalyticsService.getFeedTrend(farmId),
        farmAnalyticsService.getExpenseTrend(farmId),
        farmAnalyticsService.getInventoryTrend(farmId),
      ]);

    return [
      ...this.predictMortalityRisk(mortalityTrend),
      ...this.predictEggDecline(eggTrend),
      ...this.predictFeedShortage(feedTrend),
      ...this.predictExpenseOverrun(expenseTrend),
      ...this.predictStockoutRisk(inventoryTrend),
    ];
  }

  private predictMortalityRisk(trend: any[]): FarmPrediction[] {
    if (trend.length < 3) return [];

    const last3 = trend.slice(-3);
    const increasing =
      last3[2].count > last3[1].count && last3[1].count > last3[0].count;

    if (increasing) {
      return [
        {
          id: "mortality_risk",
          type: "MORTALITY",
          severity: PredictionSeverity.HIGH,
          message: "Mortality is trending upward and may continue increasing.",
          probability: 0.7,
          horizon: "3-5 days",
          meta: last3,
        },
      ];
    }

    return [];
  }

  private predictEggDecline(trend: any[]): FarmPrediction[] {
    if (trend.length < 3) return [];

    const last = trend.slice(-3);

    const declining =
      last[2].eggs < last[1].eggs && last[1].eggs < last[0].eggs;

    if (declining) {
      return [
        {
          id: "egg_decline",
          type: "PRODUCTION",
          severity: PredictionSeverity.MEDIUM,
          message: "Egg production is consistently declining.",
          probability: 0.65,
          horizon: "5-7 days",
        },
      ];
    }

    return [];
  }

  private predictFeedShortage(trend: any[]): FarmPrediction[] {
    const latest = trend.at(-1);
    if (!latest) return [];

    if (latest.remainingDays <= 5) {
      return [
        {
          id: "feed_shortage",
          type: "INVENTORY",
          severity: PredictionSeverity.HIGH,
          message: "Feed may run out within 5 days based on current usage.",
          probability: 0.85,
          horizon: "5 days",
          meta: latest,
        },
      ];
    }

    return [];
  }

  private predictExpenseOverrun(trend: any[]): FarmPrediction[] {
    if (trend.length < 2) return [];

    const growth =
      (trend.at(-1).total - trend.at(-2).total) / trend.at(-2).total;

    if (growth > 0.25) {
      return [
        {
          id: "expense_overrun",
          type: "FINANCE",
          severity: PredictionSeverity.MEDIUM,
          message: "Expenses are increasing rapidly and may exceed budget.",
          probability: 0.6,
          horizon: "7 days",
        },
      ];
    }

    return [];
  }

  private predictStockoutRisk(trend: any[]): FarmPrediction[] {
    return trend
      .filter((item) => item.daysToStockout <= 7)
      .map((item) => ({
        id: `stockout_${item.id}`,
        type: "INVENTORY",
        severity: PredictionSeverity.HIGH,
        message: `${item.name} may run out within ${item.daysToStockout} days.`,
        probability: 0.8,
        horizon: `${item.daysToStockout} days`,
        meta: item,
      }));
  }
}

export const predictionEngineService = new PredictionEngineService();

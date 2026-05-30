import type { Request, Response } from "express";
import { analyticsService } from "./analytics.service.js";
import { farmParamSchema } from "../farm/farm.scheme.js";
import { insightEngineService } from "./insight-engine/insight-engine.service.js";
import { predictionEngineService } from "./prediction-engine/prediction-engine.service.js";

export class AnalyticsController {
  static async getFarmOverview(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { farmId } = farmParamSchema.parse(req.params);

    const data = await analyticsService.getFarmOverview(farmId, userId);

    res.json(data);
  }

  static async getTrends(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { farmId } = farmParamSchema.parse(req.params);

    const data = await analyticsService.getTrends(farmId, userId);

    res.json(data);
  }

  static async getInsights(req: Request, res: Response): Promise<void> {
    const { farmId } = farmParamSchema.parse(req.params);

    const insights = await insightEngineService.generateInsights(farmId);

    res.json(insights);
  }

  static async getPredictions(req: Request, res: Response): Promise<void> {
    const { farmId } = farmParamSchema.parse(req.params);

    const predictions =
      await predictionEngineService.generatePredictions(farmId);

    res.json(predictions);
  }
}

import type { Request, Response } from "express";
import { dashboardSummaryService } from "./dashboard-summary.service.js";
import { farmParamSchema } from "../../farm/farm.scheme.js";

export class DashboardSummaryController {
  static async getDashboardSummary(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { farmId } = farmParamSchema.parse(req.params);

    const data = await dashboardSummaryService.generateSummary(farmId, userId);

    res.json(data);
  }
}

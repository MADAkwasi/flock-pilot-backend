import type { Request, Response, NextFunction } from "express";
import { farmService } from "./farm.service.js";
import AppError from "../../utils/appError.js";
import { updateFarmParamsSchema } from "./farm.scheme.js";

export class FarmController {
  static async createFarm(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;

    const farm = await farmService.createFarm(userId, body);

    res.status(201).json({
      status: "success",
      data: {
        farm,
      },
    });
  }

  static async getMyFarms(req: Request, res: Response): Promise<void> {
    const { userId } = req;

    const farms = await farmService.getUserFarms(userId);

    res.status(200).json({
      status: "success",
      results: farms.length,
      data: {
        farms,
      },
    });
  }

  static async getFarm(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { farmId } = updateFarmParamsSchema.parse(req.params);
    const { userId } = req;

    const farm = await farmService.getFarmById(farmId, userId);

    if (!farm) return next(new AppError("Farm not found", 404));

    res.status(200).json({
      status: "success",
      data: {
        farm,
      },
    });
  }

  static async updateFarm(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { farmId } = updateFarmParamsSchema.parse(req.params);
    const { body, userId } = req;

    const farm = await farmService.updateFarmInfo(farmId, userId, body);

    if (!farm) return next(new AppError("Farm not found", 404));

    res.status(200).json({
      status: "success",
      data: {
        farm,
      },
    });
  }
}

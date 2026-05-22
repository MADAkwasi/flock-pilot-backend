import type { Request, Response, NextFunction } from "express";
import { flockService } from "./flock.service.js";
import AppError from "../../utils/appError.js";
import { flockParamsSchema } from "./flock.schema.js";

export class FlockController {
  static async createFlock(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;

    const flock = await flockService.createFlock(userId, body);

    res.status(201).json({
      status: "success",
      data: {
        flock,
      },
    });
  }

  static async getFarmFlocks(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { farmId } = req.query;

    if (!farmId || typeof farmId !== "string")
      return next(new AppError("Farm id is required", 400));

    const { userId } = req;

    const flocks = await flockService.getFarmFlocks(farmId, userId);

    res.status(200).json({
      status: "success",
      results: flocks.length,
      data: {
        flocks,
      },
    });
  }

  static async getFlock(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const flock = await flockService.getFlock(flockId, userId);

    res.status(200).json({
      status: "success",
      data: {
        flock,
      },
    });
  }

  static async updateFlock(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const flock = await flockService.updateFlockInfo(flockId, userId, body);

    res.status(200).json({
      status: "success",
      data: {
        flock,
      },
    });
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const flock = await flockService.updateFlockStatus(flockId, userId, body);

    res.status(200).json({
      status: "success",
      data: {
        flock,
      },
    });
  }
}

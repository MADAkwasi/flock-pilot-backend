import type { Request, Response, NextFunction } from "express";
import { flockService } from "./flock.service.js";
import AppError from "../../utils/appError.js";
import { updateFlockParamsSchema } from "./flock.schema.js";

export class FlockController {
  static async createFlock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { userId, body } = req;

    const flock = await flockService.createFlock(userId, body);

    if (!flock) return next(new AppError("Farm not found", 404));

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

    if (!flocks) return next(new AppError("Flock not found", 404));

    res.status(200).json({
      status: "success",
      results: flocks.length,
      data: {
        flocks,
      },
    });
  }

  static async getFlock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { userId } = req;
    const { flockId } = updateFlockParamsSchema.parse(req.params);

    const flock = await flockService.getFlock(flockId, userId);

    if (!flock) return next(new AppError("Flock not found", 404));

    res.status(200).json({
      status: "success",
      data: {
        flock,
      },
    });
  }
}

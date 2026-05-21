import type { Request, Response, NextFunction } from "express";
import { updateFarmParamsSchema } from "../farm/farm.scheme.js";
import { flockService } from "./flock.service.js";
import AppError from "../../utils/appError.js";

export class FlockController {
  static async createFlock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { userId, body } = req;
    const { farmId } = updateFarmParamsSchema.parse(req.params);

    const flock = await flockService.createFlock(farmId, userId, body);

    if (!flock) return next(new AppError("Farm not found", 404));

    res.status(201).json({
      status: "success",
      data: {
        flock,
      },
    });
  }
}

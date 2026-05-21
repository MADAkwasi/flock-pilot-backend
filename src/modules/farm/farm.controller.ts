import type { Request, Response, NextFunction } from "express";
import { farmService } from "./farm.service.js";
import { createFarmSchema } from "./farm.scheme.js";

export class FarmController {
  static async createFarm(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;

    const farm = await farmService.createFarm(
      userId,
      createFarmSchema.parse(body),
    );

    res.status(201).json({
      message: "success",
      data: {
        farm,
      },
    });
  }
}

import type { Request, Response } from "express";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { healthService } from "./health.service.js";

export class HealthController {
  static async getHealthRecords(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const healthRecords = await healthService.getFlockHealthRecords(
      flockId,
      userId,
    );

    res.status(200).json({
      status: "message",
      results: healthRecords.length,
      data: {
        healthRecords,
      },
    });
  }
}

import type { Request, Response } from "express";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { healthService } from "./health.service.js";
import { healthRecordParamSchema } from "./health.schema.js";

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

  static async getHealthRecord(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId, healthRecordId } = healthRecordParamSchema.parse(
      req.params,
    );

    const healthRecord = await healthService.getFlockHealthRecord(
      flockId,
      userId,
      healthRecordId,
    );

    res.status(200).json({
      status: "message",
      data: {
        healthRecord,
      },
    });
  }

  static async createHealthRecord(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const healthRecord = await healthService.createFlockHealthRecord(
      flockId,
      userId,
      body,
    );

    res.status(201).json({
      status: "success",
      data: {
        healthRecord,
      },
    });
  }

  static async deleteHealthRecord(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId, healthRecordId } = healthRecordParamSchema.parse(
      req.params,
    );

    await healthService.deleteFlockHealthRecord(
      flockId,
      userId,
      healthRecordId,
    );

    res.status(200).json({
      status: "success",
      message: "Health record deleted successfully",
    });
  }

  static async updateHealthRecord(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { flockId, healthRecordId } = healthRecordParamSchema.parse(
      req.params,
    );

    const healthRecord = await healthService.updateFlockHealthRecord(
      flockId,
      userId,
      healthRecordId,
      body,
    );

    res.status(200).json({
      status: "success",
      data: {
        healthRecord,
      },
    });
  }
}

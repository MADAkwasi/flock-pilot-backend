import type { Request, Response } from "express";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { mortalityService } from "./mortality.service.js";
import { mortalityRecordParamSchema } from "./mortality.schema.js";

export class MortalityController {
  static async createMortalityRecord(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId, body } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const mortalityRecord = await mortalityService.createFlockMortalityRecord(
      flockId,
      userId,
      body,
    );

    res.status(201).json({
      status: "success",
      data: {
        mortalityRecord,
      },
    });
  }

  static async getMortalityRecords(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const mortalityRecords = await mortalityService.getFlockMortalityRecords(
      flockId,
      userId,
    );

    res.status(200).json({
      status: "success",
      results: mortalityRecords.length,
      data: {
        mortalityRecords,
      },
    });
  }

  static async getMortalityRecord(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId, recordId } = mortalityRecordParamSchema.parse(req.params);

    const mortalityRecord = await mortalityService.getFlockMortalityRecord(
      flockId,
      userId,
      recordId,
    );

    res.status(200).json({
      status: "success",
      data: {
        mortalityRecord,
      },
    });
  }
}

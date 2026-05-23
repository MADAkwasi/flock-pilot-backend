import {
  healthDetailSelect,
  healthListSelect,
} from "../../../constants/health.constant.js";
import { prisma } from "../../../db/prisma.js";
import AppError from "../../../utils/appError.js";
import { flockService } from "../../flock/flock.service.js";
import type {
  HealthWithDetailSelect,
  HealthWithListSelect,
} from "./health.type.js";

class HealthService {
  public async getFlockHealthRecords(
    flockId: string,
    ownerId: string,
  ): Promise<HealthWithListSelect[]> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.healthRecord.findMany({
      where: { flockId },
      select: healthListSelect,
    });
  }

  public async getFlockHealthRecord(
    flockId: string,
    ownerId: string,
    healthRecordId: string,
  ): Promise<HealthWithDetailSelect | null> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    const healthRecord = await prisma.healthRecord.findFirst({
      where: {
        id: healthRecordId,
        flockId,
      },
      select: healthDetailSelect,
    });

    if (!healthRecord) throw new AppError("Health Record not found", 404);

    return healthRecord;
  }
}

export const healthService = new HealthService();

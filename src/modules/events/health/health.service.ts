import {
  healthDetailSelect,
  healthListSelect,
} from "../../../constants/health.constant.js";
import { prisma } from "../../../db/prisma.js";
import type { HealthRecord } from "../../../generated/prisma/client.js";
import AppError from "../../../utils/appError.js";
import { flockService } from "../../flock/flock.service.js";
import type {
  HealthRecordDto,
  UpdateHealthRecordDto,
} from "./health.schema.js";
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

  public async createFlockHealthRecord(
    flockId: string,
    ownerId: string,
    healthRecordData: HealthRecordDto,
  ): Promise<HealthRecord> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.healthRecord.create({
      data: {
        ...healthRecordData,
        flockId,
      },
    });
  }

  public async deleteFlockHealthRecord(
    flockId: string,
    ownerId: string,
    healthRecordId: string,
  ): Promise<boolean> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    const healthRecord = await prisma.healthRecord.findFirst({
      where: { id: healthRecordId, flockId },
      select: { id: true },
    });

    if (!healthRecord) throw new AppError("Health record not found", 404);

    await prisma.healthRecord.delete({ where: { id: healthRecordId } });

    return true;
  }

  public async updateFlockHealthRecord(
    flockId: string,
    ownerId: string,
    healthRecordId: string,
    updateData: UpdateHealthRecordDto,
  ): Promise<HealthRecord | null> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    const results = await prisma.healthRecord.updateMany({
      where: {
        id: healthRecordId,
        flockId,
      },
      data: updateData,
    });

    if (results.count === 0) throw new AppError("Health record not found", 404);

    return prisma.healthRecord.findUnique({ where: { id: healthRecordId } });
  }
}

export const healthService = new HealthService();

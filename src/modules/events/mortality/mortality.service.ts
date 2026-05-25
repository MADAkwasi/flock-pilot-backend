import {
  mortalityDetailSelect,
  mortalityListSelect,
} from "../../../constants/mortality.constant.js";
import { prisma } from "../../../db/prisma.js";
import type { MortalityRecord } from "../../../generated/prisma/client.js";
import AppError from "../../../utils/appError.js";
import { flockService } from "../../flock/flock.service.js";
import type {
  MortalityRecordDto,
  UpdateMortalityRecordDto,
} from "./mortality.schema.js";
import type {
  MortalityWithDetailSelect,
  MortalityWithListSelect,
} from "./mortality.type.js";

class MortalityService {
  public async createFlockMortalityRecord(
    flockId: string,
    ownerId: string,
    mortalityData: MortalityRecordDto,
  ): Promise<MortalityRecord> {
    const flock = await flockService.ensureOwnedFlock(flockId, ownerId);

    if (mortalityData.count > flock.currentCount)
      throw new AppError(
        "Mortality count cannot exceed current flock count",
        400,
      );

    return await prisma.$transaction(async (tx) => {
      const mortalityRecord = await tx.mortalityRecord.create({
        data: {
          ...mortalityData,
          flockId,
        },
      });

      await tx.flock.update({
        where: { id: flockId },
        data: {
          currentCount: { decrement: mortalityData.count },
        },
        select: { id: true },
      });

      return mortalityRecord;
    });
  }

  public async getFlockMortalityRecords(
    flockId: string,
    ownerId: string,
  ): Promise<MortalityWithListSelect[]> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.mortalityRecord.findMany({
      where: {
        flockId,
      },
      select: mortalityListSelect,
    });
  }

  public async getFlockMortalityRecord(
    flockId: string,
    ownerId: string,
    mortalityRecordId: string,
  ): Promise<MortalityWithDetailSelect> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    const mortalityRecord = await prisma.mortalityRecord.findFirst({
      where: { id: mortalityRecordId, flockId },
      select: mortalityDetailSelect,
    });

    if (!mortalityRecord) throw new AppError("Mortality record not found", 404);

    return mortalityRecord;
  }

  public async updateFlockMortalityRecord(
    flockId: string,
    ownerId: string,
    mortalityRecordId: string,
    updateData: UpdateMortalityRecordDto,
  ): Promise<MortalityWithDetailSelect> {
    const flock = await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.$transaction(async (tx) => {
      const record = await tx.mortalityRecord.findFirst({
        where: { id: mortalityRecordId, flockId },
      });

      if (!record) throw new AppError("Mortality record not found", 404);

      const availableCount = flock.currentCount + record.count;

      if (updateData.count !== undefined && updateData.count > availableCount) {
        throw new AppError(
          "Mortality count exceeds available flock population",
          400,
        );
      }

      const updatedRecord = await tx.mortalityRecord.update({
        where: { id: mortalityRecordId },
        data: updateData,
        select: mortalityDetailSelect,
      });

      if (updateData.count !== undefined) {
        const difference = updatedRecord.count - record.count;

        await tx.flock.update({
          where: { id: flockId },
          data: {
            currentCount:
              difference > 0
                ? { decrement: difference }
                : { increment: Math.abs(difference) },
          },
        });
      }

      return updatedRecord;
    });
  }

  public async deleteFlockMortalityRecord(
    flockId: string,
    ownerId: string,
    mortalityRecordId: string,
  ): Promise<void> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    await prisma.$transaction(async (tx) => {
      const record = await tx.mortalityRecord.findFirst({
        where: {
          id: mortalityRecordId,
          flockId,
        },
        select: {
          id: true,
          count: true,
        },
      });

      if (!record) throw new AppError("Mortality record not found", 404);

      await tx.flock.update({
        where: {
          id: flockId,
        },
        data: {
          currentCount: {
            increment: record.count,
          },
        },
      });

      await tx.mortalityRecord.delete({
        where: {
          id: mortalityRecordId,
        },
      });
    });
  }
}

export const mortalityService = new MortalityService();

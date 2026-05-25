import {
  mortalityDetailSelect,
  mortalityListSelect,
} from "../../../constants/mortality.constant.js";
import { prisma } from "../../../db/prisma.js";
import type { MortalityRecord } from "../../../generated/prisma/client.js";
import AppError from "../../../utils/appError.js";
import { flockService } from "../../flock/flock.service.js";
import type { MortalityRecordDto } from "./mortality.schema.js";
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
    let mortalityRecord: MortalityRecord;

    const flock = await flockService.ensureOwnedFlock(flockId, ownerId);

    if (mortalityData.count > flock.currentCount)
      throw new AppError(
        "Mortality count cannot exceed current flock count",
        400,
      );

    return await prisma.$transaction(async (tx) => {
      mortalityRecord = await tx.mortalityRecord.create({
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
    recordId: string,
  ): Promise<MortalityWithDetailSelect> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    const mortalityRecord = await prisma.mortalityRecord.findFirst({
      where: { id: recordId, flockId },
      select: mortalityDetailSelect,
    });

    if (!mortalityRecord) throw new AppError("Mortality record not found", 404);

    return mortalityRecord;
  }
}

export const mortalityService = new MortalityService();

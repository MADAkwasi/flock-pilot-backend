import {
  flockDetailSelect,
  flockListSelect,
} from "../../constants/flock.constant.js";
import { prisma } from "../../db/prisma.js";
import type { Flock } from "../../generated/prisma/client.js";
import type {
  FlockWithDetailSelect,
  FlockWithListSelect,
  FlockWithStatusSelect,
} from "./flock.type.js";
import AppError from "../../utils/appError.js";
import type {
  FlockDto,
  FlockStatusDto,
  FlockUpdateDto,
} from "./flock.schema.js";

class FlockService {
  public async createFlock(
    ownerId: string,
    farmId: string,
    flockData: FlockDto,
  ): Promise<Flock> {
    const farm = await prisma.farm.findFirst({
      where: { id: farmId, ownerId, isActive: true },
      select: { id: true },
    });

    if (!farm) throw new AppError("Farm not found", 404);

    return prisma.flock.create({
      data: {
        ...flockData,
        farmId,
        currentCount: flockData.initialCount,
      },
    });
  }

  public async getFarmFlocks(
    farmId: string,
    ownerId: string,
  ): Promise<FlockWithListSelect[]> {
    const farm = await prisma.farm.findFirst({
      where: { id: farmId, ownerId },
      select: { id: true },
    });

    if (!farm) throw new AppError("Farm not found", 404);

    const flocks = await prisma.flock.findMany({
      where: {
        farm: {
          id: farmId,
          ownerId,
        },
      },
      select: flockListSelect,
    });

    return flocks;
  }

  public async getFlock(
    flockId: string,
    ownerId: string,
  ): Promise<FlockWithDetailSelect> {
    const flock = await prisma.flock.findFirst({
      where: {
        id: flockId,
        farm: {
          ownerId,
        },
      },
      select: flockDetailSelect,
    });

    if (!flock) throw new AppError("Flock not found", 404);

    return flock;
  }

  public async updateFlockInfo(
    flockId: string,
    ownerId: string,
    updateData: FlockUpdateDto,
  ): Promise<FlockWithListSelect | null> {
    const result = await prisma.flock.updateMany({
      where: {
        id: flockId,
        farm: { ownerId },
      },
      data: updateData,
    });

    if (result.count === 0) throw new AppError("Flock not found", 404);

    return prisma.flock.findFirst({
      where: { id: flockId },
      select: flockListSelect,
    });
  }

  public async updateFlockStatus(
    flockId: string,
    ownerId: string,
    status: FlockStatusDto,
  ): Promise<FlockWithStatusSelect | null> {
    const result = await prisma.flock.updateMany({
      where: {
        id: flockId,
        farm: { ownerId },
      },
      data: status,
    });

    if (result.count === 0) throw new AppError("Flock not found", 404);

    return prisma.flock.findUnique({
      where: {
        id: flockId,
      },
      select: {
        status: true,
        updatedAt: true,
      },
    });
  }

  public async ensureOwnedFlock(flockId: string, ownerId: string) {
    const flock = await prisma.flock.findFirst({
      where: {
        id: flockId,
        farm: {
          ownerId,
        },
      },
      select: {
        id: true,
        farmId: true,
        currentCount: true,
      },
    });

    if (!flock) throw new AppError("Flock not found", 404);

    return flock;
  }
}

export const flockService = new FlockService();

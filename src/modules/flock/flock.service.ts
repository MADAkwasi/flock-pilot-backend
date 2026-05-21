import {
  flockDetailSelect,
  flockListSelect,
} from "../../constants/flock.constant.js";
import { prisma } from "../../db/prisma.js";
import type { Flock } from "../../generated/prisma/client.js";
import type {
  FlockWithDetailSelect,
  FlockWithListSelect,
} from "../../types/flock.type.js";
import type { FlockDto } from "./flock.schema.js";

class FlockService {
  public async createFlock(
    ownerId: string,
    flockData: FlockDto,
  ): Promise<Flock | null> {
    const farm = await prisma.farm.findFirst({
      where: { id: flockData.farmId, ownerId, isActive: true },
      select: { id: true },
    });

    if (!farm) return null;

    return await prisma.flock.create({
      data: {
        ...flockData,
        currentCount: flockData.initialCount,
      },
    });
  }

  public async getFarmFlocks(
    farmId: string,
    ownerId: string,
  ): Promise<FlockWithListSelect[] | null> {
    const farm = await prisma.farm.findFirst({
      where: {
        id: farmId,
        ownerId,
      },
      select: {
        id: true,
      },
    });

    if (!farm) return null;

    const flocks = await prisma.flock.findMany({
      where: {
        farmId,
        farm: {
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
  ): Promise<FlockWithDetailSelect | null> {
    const flock = await this.getOwnedFlock(flockId, ownerId);

    if (!flock) return null;

    return flock;
  }

  private async getOwnedFlock(flockId: string, ownerId: string) {
    return prisma.flock.findFirst({
      where: {
        id: flockId,
        farm: {
          ownerId,
        },
      },
      select: flockDetailSelect,
    });
  }
}

export const flockService = new FlockService();

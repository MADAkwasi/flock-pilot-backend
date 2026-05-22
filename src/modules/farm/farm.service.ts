import {
  farmActiveSelect,
  farmDetailSelect,
} from "../../constants/farm.constant.js";
import { prisma } from "../../db/prisma.js";
import type { Farm } from "../../generated/prisma/client.js";
import type {
  FarmWithActiveSelect,
  FarmWithDetailSelect,
} from "../../types/farm.type.js";
import AppError from "../../utils/appError.js";
import type { CreateFarmDto, UpdateFarmDto } from "./farm.scheme.js";

class FarmService {
  public async createFarm(
    ownerId: string,
    farmData: CreateFarmDto,
  ): Promise<Farm> {
    const newFarm = await prisma.farm.create({
      data: {
        ...farmData,
        ownerId,
      },
    });

    return newFarm;
  }

  public async getUserFarms(ownerId: string): Promise<Farm[]> {
    const farms = await prisma.farm.findMany({
      where: { ownerId, isActive: true },
    });

    return farms;
  }

  public async getFarmUserById(
    id: string,
    ownerId: string,
  ): Promise<FarmWithDetailSelect | null> {
    const farm = await prisma.farm.findFirst({
      where: { id, ownerId },
      select: farmDetailSelect,
    });

    if (!farm) throw new AppError("Farm not Found", 404);

    return farm;
  }

  public async updateFarmInfo(
    id: string,
    ownerId: string,
    updateData: UpdateFarmDto,
  ): Promise<FarmWithDetailSelect | null> {
    const result = await prisma.farm.updateMany({
      where: { id, ownerId, isActive: true },
      data: updateData,
    });

    if (result.count === 0) throw new AppError("Farm not found", 404);

    return prisma.farm.findUnique({
      where: { id },
      select: farmDetailSelect,
    });
  }

  public async deactivateFarm(
    id: string,
    ownerId: string,
  ): Promise<FarmWithActiveSelect | null> {
    return this.setFarmStatus(id, ownerId, false);
  }

  public async activateFarm(
    id: string,
    ownerId: string,
  ): Promise<FarmWithActiveSelect | null> {
    return this.setFarmStatus(id, ownerId, true);
  }

  private async setFarmStatus(
    id: string,
    ownerId: string,
    isActive: boolean,
  ): Promise<FarmWithActiveSelect | null> {
    const result = await prisma.farm.updateMany({
      where: { id, ownerId },
      data: { isActive },
    });

    if (result.count === 0) throw new AppError("Farm not found", 404);

    return prisma.farm.findUnique({
      where: { id },
      select: farmActiveSelect,
    });
  }

  public async getFarmDashboard(farmId: string, ownerId: string) {
    const farm = await prisma.farm.findFirst({
      where: {
        id: farmId,
        ownerId,
        isActive: true,
      },
      select: { id: true },
    });

    if (!farm) throw new AppError("Farm not found", 404);

    const flockStats = await prisma.flock.aggregate({
      where: { farmId },
      _count: { id: true },
      _sum: {
        initialCount: true,
        currentCount: true,
      },
    });

    const mortalityStats = await prisma.mortalityRecord.aggregate({
      where: {
        flock: { farmId },
      },
      _sum: {
        count: true,
      },
    });

    const eggStats = await prisma.eggProduction.aggregate({
      where: {
        flock: { farmId },
      },
      _sum: {
        count: true,
      },
    });

    return {
      farmId,
      totalFlocks: flockStats._count.id,
      totalInitialBirds: flockStats._sum.initialCount ?? 0,
      totalCurrentBirds: flockStats._sum.currentCount ?? 0,
      totalMortality: mortalityStats._sum.count ?? 0,
      totalEggs: eggStats._sum.count ?? 0,
      mortalityRate: flockStats._sum.initialCount
        ? ((mortalityStats._sum.count ?? 0) / flockStats._sum.initialCount) *
          100
        : 0,
    };
  }
}

export const farmService = new FarmService();

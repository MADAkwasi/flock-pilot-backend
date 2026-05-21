import { farmDetailSelect } from "../../constants/farm.constant.js";
import { prisma } from "../../db/prisma.js";
import type { Farm } from "../../generated/prisma/client.js";
import type { FarmWithDetailSelect } from "../../types/farm.type.js";
import type { CreateFarmDto, UpdateFarmDto } from "./farm.scheme.js";

class FarmService {
  public async createFarm(
    ownerId: string,
    farmData: CreateFarmDto,
  ): Promise<Farm> {
    const newFarm = await prisma.farm.create({
      data: {
        ownerId,
        ...farmData,
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

    if (!farm) return null;

    return farm;
  }

  public async updateFarmInfo(
    id: string,
    ownerId: string,
    updateData: UpdateFarmDto,
  ): Promise<FarmWithDetailSelect | null> {
    const farm = await prisma.farm.findFirst({
      where: { id, ownerId, isActive: true },
    });

    if (!farm) return null;

    return prisma.farm.update({
      where: { id },
      data: updateData,
      select: farmDetailSelect,
    });
  }

  public async deactivateFarm(
    id: string,
    ownerId: string,
  ): Promise<Farm | null> {
    return this.setFarmStatus(id, ownerId, false);
  }

  public async activateFarm(id: string, ownerId: string): Promise<Farm | null> {
    return this.setFarmStatus(id, ownerId, true);
  }

  private async setFarmStatus(
    id: string,
    ownerId: string,
    isActive: boolean,
  ): Promise<Farm | null> {
    const farm = await prisma.farm.findFirst({
      where: { id, ownerId },
      select: { id: true },
    });

    if (!farm) return null;

    return prisma.farm.update({
      where: { id },
      data: { isActive },
    });
  }
}

export const farmService = new FarmService();

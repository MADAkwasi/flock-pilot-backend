import { prisma } from "../../db/prisma.js";
import type { Farm } from "../../generated/prisma/client.js";
import type { CreateFarmDto } from "./farm.scheme.js";

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
}

export const farmService = new FarmService();

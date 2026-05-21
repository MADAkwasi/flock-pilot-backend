import { prisma } from "../../db/prisma.js";
import type { Flock } from "../../generated/prisma/client.js";
import type { FlockDto } from "./flock.schema.js";

class FlockService {
  public async createFlock(
    farmId: string,
    ownerId: string,
    flockData: FlockDto,
  ): Promise<Flock | null> {
    const farm = await prisma.farm.findFirst({
      where: { id: farmId, ownerId, isActive: true },
      select: { id: true },
    });

    if (!farm) return null;

    return await prisma.flock.create({
      data: {
        farmId,
        ...flockData,
      },
    });
  }
}

export const flockService = new FlockService();

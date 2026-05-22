import { healthListSelect } from "../../../constants/health.constant.js";
import { prisma } from "../../../db/prisma.js";
import { flockService } from "../../flock/flock.service.js";
import type { HealthWithListSelect } from "./health.type.js";

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
}

export const healthService = new HealthService();

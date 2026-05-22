import { prisma } from "../../../db/prisma.js";
import type { FeedLog } from "../../../generated/prisma/client.js";
import AppError from "../../../utils/appError.js";
import { flockService } from "../../flock/flock.service.js";
import type { CreateFeedDto } from "./feed.schema.js";

class FeedLogService {
  public async createFeedLog(
    ownerId: string,
    flockId: string,
    feedData: CreateFeedDto,
  ): Promise<FeedLog> {
    const flock = await flockService.ensureOwnedFlock(flockId, ownerId);

    if (!flock) throw new AppError("Flock not found", 404);

    return prisma.feedLog.create({
      data: {
        ...feedData,
        flockId: flock.id,
      },
    });
  }
}

export const feedLogService = new FeedLogService();

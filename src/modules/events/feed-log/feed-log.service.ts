import {
  feedLogDetailSelect,
  feedLogListSelect,
} from "../../../constants/feed-log.constant.js";
import { prisma } from "../../../db/prisma.js";
import type { FeedLog } from "../../../generated/prisma/client.js";
import { flockService } from "../../flock/flock.service.js";
import type {
  FeedLogWithDetailSelect,
  FeedLogWithListSelect,
} from "./feed-log.type.js";
import type { CreateFeedDto } from "./feed-log.schema.js";
import AppError from "../../../utils/appError.js";

class FeedLogService {
  public async createFeedLog(
    ownerId: string,
    flockId: string,
    feedData: CreateFeedDto,
  ): Promise<FeedLog> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.feedLog.create({
      data: {
        ...feedData,
        flockId,
      },
    });
  }

  public async getFlockFeedLogs(
    ownerId: string,
    flockId: string,
  ): Promise<FeedLogWithListSelect[]> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.feedLog.findMany({
      where: {
        flockId,
      },
      select: feedLogListSelect,
    });
  }

  public async getFeedLog(
    ownerId: string,
    flockId: string,
    feedLogId: string,
  ): Promise<FeedLogWithDetailSelect | null> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    const log = await prisma.feedLog.findFirst({
      where: {
        id: feedLogId,
        flockId,
      },
      select: feedLogDetailSelect,
    });

    if (!log) throw new AppError("Feed log not found", 404);

    return log;
  }
}

export const feedLogService = new FeedLogService();

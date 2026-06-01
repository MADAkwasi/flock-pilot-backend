import {
  feedLogDetailSelect,
  feedLogListSelect,
} from "../../../constants/feed-log.constant.js";
import { prisma } from "../../../db/prisma.js";
import {
  InventoryTransactionType,
  type FeedLog,
} from "../../../generated/prisma/client.js";
import { flockService } from "../../flock/flock.service.js";
import type {
  FeedLogWithDetailSelect,
  FeedLogWithListSelect,
} from "./feed-log.type.js";
import type { FeedLogDto, UpdateFeedLogDto } from "./feed-log.schema.js";
import AppError from "../../../utils/appError.js";

class FeedLogService {
  public async createFeedLog(
    ownerId: string,
    flockId: string,
    feedData: FeedLogDto,
  ): Promise<FeedLog> {
    const { farmId } = await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.$transaction(async (tx) => {
      const inventoryItem = await tx.inventoryItem.findFirst({
        where: {
          id: feedData.inventoryItemId,
          farmId,
        },
      });

      if (!inventoryItem) {
        throw new AppError("Feed inventory item not found", 404);
      }

      const feedLog = await tx.feedLog.create({
        data: {
          flockId,
          inventoryItemId: inventoryItem.id,
          feedType: inventoryItem.name,
          quantityKg: feedData.quantityKg,
          notes: feedData.notes,
        },
      });

      await tx.inventoryTransaction.create({
        data: {
          farmId,
          flockId,
          inventoryItemId: inventoryItem.id,
          type: InventoryTransactionType.CONSUMPTION,
          quantity: -feedData.quantityKg,
          notes: "Feed consumption",
        },
      });

      await tx.flock.update({
        where: { id: flockId },
        data: {
          feedConsumed: {
            increment: feedData.quantityKg,
          },
        },
      });

      return feedLog;
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

  public async updateFeedLog(
    ownerId: string,
    flockId: string,
    feedLogId: string,
    updateData: UpdateFeedLogDto,
  ): Promise<FeedLogWithListSelect> {
    const { farmId } = await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.$transaction(async (tx) => {
      const existing = await tx.feedLog.findFirst({
        where: {
          id: feedLogId,
          flockId,
        },
      });

      if (!existing) {
        throw new AppError("Feed log not found", 404);
      }

      const newQuantity = updateData.quantityKg ?? existing.quantityKg;

      const delta = newQuantity - existing.quantityKg;

      if (delta !== 0) {
        await tx.inventoryTransaction.create({
          data: {
            farmId,
            flockId,
            inventoryItemId: existing.inventoryItemId,
            type: InventoryTransactionType.ADJUSTMENT,
            quantity: -delta,
            notes: "Feed log adjustment",
          },
        });

        await tx.flock.update({
          where: { id: flockId },
          data: {
            feedConsumed: {
              increment: delta,
            },
          },
        });
      }

      await tx.feedLog.update({
        where: {
          id: feedLogId,
        },
        data: {
          quantityKg: newQuantity,
          notes: updateData.notes,
        },
      });

      return tx.feedLog.findUniqueOrThrow({
        where: {
          id: feedLogId,
        },
        select: feedLogListSelect,
      });
    });
  }

  public async deleteFeedLog(
    ownerId: string,
    flockId: string,
    feedLogId: string,
  ): Promise<boolean> {
    const { farmId } = await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.$transaction(async (tx) => {
      const log = await tx.feedLog.findFirst({
        where: {
          id: feedLogId,
          flockId,
        },
      });

      if (!log) {
        throw new AppError("Feed log not found", 404);
      }

      await tx.inventoryTransaction.create({
        data: {
          farmId,
          flockId,
          inventoryItemId: log.inventoryItemId,
          type: InventoryTransactionType.ADJUSTMENT,
          quantity: log.quantityKg,
          notes: "Reversal of deleted feed log",
        },
      });

      await tx.flock.update({
        where: { id: flockId },
        data: {
          feedConsumed: {
            decrement: log.quantityKg,
          },
        },
      });

      await tx.feedLog.delete({
        where: {
          id: feedLogId,
        },
      });

      return true;
    });
  }
}

export const feedLogService = new FeedLogService();

import {
  eggProductionDetailSelect,
  eggProductionListSelect,
} from "../../../constants/eggs.constant.js";
import { prisma } from "../../../db/prisma.js";
import {
  FlockType,
  InventoryCategory,
  InventoryTransactionType,
  type EggProduction,
} from "../../../generated/prisma/client.js";
import AppError from "../../../utils/appError.js";
import { flockService } from "../../flock/flock.service.js";
import type { EggProductionDto } from "./eggs.schema.js";
import type {
  EggProductionWithDetailSelect,
  EggProductionWithListSelect,
} from "./eggs.type.js";

class EggProductionService {
  public async createEggProduction(
    flockId: string,
    ownerId: string,
    productionData: EggProductionDto,
  ): Promise<EggProduction> {
    const { farmId, flockType } = await flockService.ensureOwnedFlock(
      flockId,
      ownerId,
    );

    if (flockType !== FlockType.LAYER) {
      throw new AppError(
        "Egg production can only be recorded for layer flocks",
        400,
      );
    }

    return prisma.$transaction(async (tx) => {
      const eggProduction = await tx.eggProduction.create({
        data: {
          ...productionData,
          flockId,
        },
      });

      let eggInventory = await tx.inventoryItem.findFirst({
        where: {
          farmId,
          name: "Eggs",
        },
      });

      if (!eggInventory) {
        eggInventory = await tx.inventoryItem.create({
          data: {
            farmId,
            name: "Eggs",
            category: InventoryCategory.EGGS,
            unit: "pieces",
          },
        });
      }

      const validEggCount = Math.max(
        0,
        productionData.count - (productionData.broken ?? 0),
      );

      await tx.inventoryTransaction.create({
        data: {
          farmId,
          flockId,
          inventoryItemId: eggInventory.id,
          type: InventoryTransactionType.PRODUCTION,
          quantity: validEggCount,
          notes: "Egg production recorded",
        },
      });

      await tx.flock.update({
        where: { id: flockId },
        data: {
          eggsLaid: {
            increment: validEggCount,
          },
        },
      });

      return eggProduction;
    });
  }

  public async getFlockEggProductionHistory(
    flockId: string,
    ownerId: string,
  ): Promise<EggProductionWithListSelect[]> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.eggProduction.findMany({
      where: {
        flockId,
      },
      select: eggProductionListSelect,
    });
  }

  public async getFlockEggProduction(
    flockId: string,
    ownerId: string,
    productionId: string,
  ): Promise<EggProductionWithDetailSelect> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    const eggProduction = await prisma.eggProduction.findUnique({
      where: { id: productionId },
      select: eggProductionDetailSelect,
    });

    if (!eggProduction)
      throw new AppError("Egg production record not found", 404);

    return eggProduction;
  }

  public async deleteFlockEggProduction(
    flockId: string,
    ownerId: string,
    productionId: string,
  ): Promise<void> {
    const { farmId } = await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.$transaction(async (tx) => {
      const eggProduction = await tx.eggProduction.findFirst({
        where: {
          id: productionId,
          flockId,
        },
      });

      if (!eggProduction) {
        throw new AppError("Egg production record not found", 404);
      }

      const validEggCount = Math.max(
        0,
        eggProduction.count - (eggProduction.broken ?? 0),
      );

      const eggInventory = await tx.inventoryItem.findFirst({
        where: {
          farmId,
          name: "Eggs",
        },
      });

      if (!eggInventory) {
        throw new AppError("Egg inventory record not found", 404);
      }

      await tx.inventoryTransaction.create({
        data: {
          farmId,
          flockId,
          inventoryItemId: eggInventory.id,
          type: InventoryTransactionType.ADJUSTMENT,
          quantity: -validEggCount,
          notes: "Reversal of deleted egg production",
        },
      });

      await tx.flock.update({
        where: { id: flockId },
        data: {
          eggsLaid: {
            decrement: validEggCount,
          },
        },
      });

      await tx.eggProduction.delete({
        where: {
          id: eggProduction.id,
        },
      });
    });
  }

  public async updateEggProduction(
    flockId: string,
    ownerId: string,
    productionId: string,
    updateData: EggProductionDto,
  ): Promise<EggProduction> {
    const { flockType, farmId } = await flockService.ensureOwnedFlock(
      flockId,
      ownerId,
    );

    if (flockType !== FlockType.LAYER) {
      throw new AppError(
        "Egg production can only be recorded for layer flocks",
        400,
      );
    }

    return prisma.$transaction(async (tx) => {
      const existing = await tx.eggProduction.findFirst({
        where: {
          id: productionId,
          flockId,
        },
      });

      if (!existing) {
        throw new AppError("Egg production record not found", 404);
      }

      const oldValid = Math.max(0, existing.count - (existing.broken ?? 0));

      const newCount = updateData.count ?? existing.count;
      const newBroken = updateData.broken ?? existing.broken;

      const newValid = Math.max(0, newCount - newBroken);

      const delta = newValid - oldValid;

      const eggInventory = await tx.inventoryItem.findFirst({
        where: {
          farmId,
          name: "Eggs",
        },
      });

      if (!eggInventory) {
        throw new AppError("Egg inventory record not found", 404);
      }

      if (delta !== 0) {
        await tx.inventoryTransaction.create({
          data: {
            farmId,
            flockId,
            inventoryItemId: eggInventory.id,
            type: InventoryTransactionType.ADJUSTMENT,
            quantity: delta,
            notes: "Adjustment from egg production update",
          },
        });

        await tx.flock.update({
          where: { id: flockId },
          data: {
            eggsLaid: {
              increment: delta,
            },
          },
        });
      }

      return tx.eggProduction.update({
        where: {
          id: productionId,
        },
        data: {
          count: newCount,
          broken: newBroken,
        },
      });
    });
  }
}

export const eggProductionService = new EggProductionService();

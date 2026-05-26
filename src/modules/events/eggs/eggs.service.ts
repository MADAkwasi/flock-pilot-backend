import {
  eggProductionDetailSelect,
  eggProductionListSelect,
} from "../../../constants/eggs.constants.js";
import { prisma } from "../../../db/prisma.js";
import {
  FlockType,
  InventoryCategory,
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

    const validEggCount = Math.max(
      0,
      productionData.count - (productionData.broken ?? 0),
    );

    return prisma.$transaction(async (tx) => {
      const eggProduction = await tx.eggProduction.create({
        data: {
          ...productionData,
          flockId,
        },
      });

      const existingEggInventory = await tx.inventoryItem.findFirst({
        where: {
          farmId,
          name: "Eggs",
        },
      });

      if (existingEggInventory) {
        await tx.inventoryItem.update({
          where: {
            id: existingEggInventory.id,
          },
          data: {
            quantity: {
              increment: validEggCount,
            },
          },
        });
      } else {
        await tx.inventoryItem.create({
          data: {
            farmId,
            name: "Eggs",
            category: InventoryCategory.EGGS,
            unit: "pieces",
            quantity: validEggCount,
          },
        });
      }

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
    const flock = await flockService.ensureOwnedFlock(flockId, ownerId);

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
        eggProduction.count - eggProduction.broken,
      );

      const eggInventory = await tx.inventoryItem.findFirst({
        where: {
          farmId: flock.farmId,
          name: "Eggs",
        },
      });

      if (!eggInventory) {
        throw new AppError("Egg inventory record not found", 404);
      }

      if (eggInventory.quantity < validEggCount) {
        throw new AppError(
          "Cannot delete production record because eggs have already been consumed or sold",
          400,
        );
      }

      await tx.inventoryItem.update({
        where: {
          id: eggInventory.id,
        },
        data: {
          quantity: {
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
    const flock = await flockService.ensureOwnedFlock(flockId, ownerId);

    if (flock.flockType !== FlockType.LAYER) {
      throw new AppError(
        "Egg production can only be recorded for layer flocks",
        400,
      );
    }

    return prisma.$transaction(async (tx) => {
      const existingProduction = await tx.eggProduction.findFirst({
        where: {
          id: productionId,
          flockId,
        },
      });

      if (!existingProduction)
        throw new AppError("Egg production record not found", 404);

      const oldValidEggCount = Math.max(
        0,
        existingProduction.count - existingProduction.broken,
      );

      const newValidEggCount = Math.max(
        0,
        updateData.count - (updateData.broken ?? 0),
      );

      const inventoryDifference = newValidEggCount - oldValidEggCount;

      const eggInventory = await tx.inventoryItem.findFirst({
        where: {
          farmId: flock.farmId,
          name: "Eggs",
        },
      });

      if (!eggInventory)
        throw new AppError("Egg inventory record not found", 404);

      if (
        inventoryDifference < 0 &&
        eggInventory.quantity < Math.abs(inventoryDifference)
      ) {
        throw new AppError(
          "Cannot reduce egg production below already consumed or sold inventory",
          400,
        );
      }

      await tx.inventoryItem.update({
        where: {
          id: eggInventory.id,
        },
        data: {
          quantity:
            inventoryDifference >= 0
              ? {
                  increment: inventoryDifference,
                }
              : {
                  decrement: Math.abs(inventoryDifference),
                },
        },
      });

      return tx.eggProduction.update({
        where: {
          id: productionId,
        },
        data: {
          ...updateData,
        },
      });
    });
  }
}

export const eggProductionService = new EggProductionService();

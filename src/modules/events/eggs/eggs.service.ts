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

    console.log(validEggCount);
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
}

export const eggProductionService = new EggProductionService();

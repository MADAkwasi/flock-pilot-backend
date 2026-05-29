import {
  inventoryItemDetailSelect,
  inventoryItemListSelect,
} from "../../constants/inventory-items.constant.js";
import { prisma } from "../../db/prisma.js";
import {
  InventoryTransactionType,
  type InventoryItem,
} from "../../generated/prisma/client.js";
import AppError from "../../utils/appError.js";
import { farmService } from "../farm/farm.service.js";
import type {
  AdjustInventoryItemDto,
  CLearInventoryItemDto,
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
} from "./inventory-items.schema.js";
import type {
  InventoryItemWithDetailSelect,
  InventoryItemWithListSelect,
} from "./inventory-items.type.js";

class InventoryItemService {
  public async createInventoryItem(
    farmId: string,
    ownerId: string,
    data: CreateInventoryItemDto,
  ): Promise<InventoryItem> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    return prisma.$transaction(async (tx) => {
      const existingActive = await tx.inventoryItem.findFirst({
        where: {
          farmId,
          name: data.name,
          category: data.category,
          isDeleted: false,
        },
      });

      if (existingActive) {
        throw new AppError("Inventory item already exists", 409);
      }

      const existingArchived = await tx.inventoryItem.findFirst({
        where: {
          farmId,
          name: data.name,
          category: data.category,
          isDeleted: true,
        },
      });

      if (existingArchived) {
        throw new AppError(
          "This item exists but is archived. Please restore it instead.",
          409,
        );
      }

      const inventoryItem = await tx.inventoryItem.create({
        data: {
          farmId,
          name: data.name,
          category: data.category,
          unit: data.unit,
          reorderLevel: data.reorderLevel,
          costPerUnit: data.costPerUnit,
        },
      });

      if (data.openingStock && data.openingStock > 0) {
        await tx.inventoryTransaction.create({
          data: {
            farmId,

            inventoryItemId: inventoryItem.id,

            type: InventoryTransactionType.OPENING_BALANCE,

            quantity: data.openingStock,

            unitCost: data.costPerUnit,

            notes: "Opening inventory balance",
          },
        });
      }

      return inventoryItem;
    });
  }

  public async getFarmInventories(
    farmId: string,
    ownerId: string,
  ): Promise<InventoryItemWithListSelect[]> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    return prisma.inventoryItem.findMany({
      where: {
        farmId,
        isDeleted: false,
      },
      select: inventoryItemListSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  public async getInventoryItem(
    farmId: string,
    ownerId: string,
    itemId: string,
  ): Promise<InventoryItemWithDetailSelect> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const item = await prisma.inventoryItem.findFirst({
      where: {
        id: itemId,
        farmId,
        isDeleted: false,
      },
      select: inventoryItemDetailSelect,
    });

    if (!item) throw new AppError("Inventory item not found", 404);

    return item;
  }

  public async updateInventoryItem(
    farmId: string,
    ownerId: string,
    itemId: string,
    data: UpdateInventoryItemDto,
  ): Promise<InventoryItemWithListSelect> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const item = await prisma.inventoryItem.findFirst({
      where: { id: itemId, farmId, isDeleted: false },
    });

    if (!item) throw new AppError("Inventory item not found", 404);

    return prisma.inventoryItem.update({
      where: { id: itemId },
      data,
      select: inventoryItemListSelect,
    });
  }

  public async deleteInventoryItem(
    farmId: string,
    ownerId: string,
    itemId: string,
  ): Promise<boolean> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const item = await prisma.inventoryItem.findFirst({
      where: { id: itemId, farmId },
    });

    if (!item) throw new AppError("Inventory item not found", 404);

    const NON_BLOCKING_TYPES = [InventoryTransactionType.OPENING_BALANCE];

    const blockingTx = await prisma.inventoryTransaction.findFirst({
      where: {
        inventoryItemId: itemId,
        type: {
          notIn: NON_BLOCKING_TYPES,
        },
      },
    });

    if (blockingTx) {
      throw new AppError(
        "Cannot delete inventory item with operational history. Archive it instead.",
        400,
      );
    }

    await prisma.inventoryItem.delete({
      where: { id: itemId },
    });

    return true;
  }

  public async archiveInventoryItem(
    farmId: string,
    ownerId: string,
    itemId: string,
  ): Promise<InventoryItem> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const item = await prisma.inventoryItem.findFirst({
      where: { id: itemId, farmId },
    });

    if (!item) throw new AppError("Inventory item not found", 404);

    return prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        isDeleted: true,
      },
    });
  }

  public async getCurrentStock(
    farmId: string,
    ownerId: string,
    itemId: string,
  ): Promise<number> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const result = await prisma.inventoryTransaction.aggregate({
      where: { inventoryItemId: itemId },
      _sum: {
        quantity: true,
      },
    });

    return result._sum.quantity ?? 0;
  }

  public async clearInventoryStock(
    farmId: string,
    ownerId: string,
    itemId: string,
    { reason }: CLearInventoryItemDto,
  ): Promise<void> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    return prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findFirst({
        where: {
          id: itemId,
          farmId,
        },
      });

      if (!item) throw new AppError("Inventory item not found", 404);

      const result = await tx.inventoryTransaction.aggregate({
        where: { inventoryItemId: itemId },
        _sum: {
          quantity: true,
        },
      });

      const currentStock = result._sum.quantity ?? 0;

      if (currentStock <= 0) throw new AppError("Stock is already empty", 400);

      await tx.inventoryTransaction.create({
        data: {
          farmId,
          inventoryItemId: itemId,

          type: InventoryTransactionType.ADJUSTMENT,

          quantity: -currentStock,

          unitCost: item.costPerUnit ?? undefined,

          notes: reason ?? "Stock cleared (system adjustment)",

          referenceId: null,
        },
      });
    });
  }

  public async adjustInventoryStock(
    farmId: string,
    ownerId: string,
    itemId: string,
    { newQuantity, reason }: AdjustInventoryItemDto,
  ): Promise<void> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    return prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findFirst({
        where: {
          id: itemId,
          farmId,
        },
      });

      if (!item) throw new AppError("Inventory item not found", 404);

      const aggregate = await tx.inventoryTransaction.aggregate({
        where: {
          inventoryItemId: itemId,
        },
        _sum: {
          quantity: true,
        },
      });

      const currentStock = aggregate._sum.quantity ?? 0;

      const adjustmentAmount = newQuantity - currentStock;

      if (adjustmentAmount === 0)
        throw new AppError("Stock is already at this quantity", 400);

      await tx.inventoryTransaction.create({
        data: {
          farmId,

          inventoryItemId: itemId,

          type: InventoryTransactionType.ADJUSTMENT,

          quantity: adjustmentAmount,

          unitCost: item.costPerUnit ?? undefined,

          notes: reason,
        },
      });
    });
  }

  public async restoreInventoryItem(
    farmId: string,
    ownerId: string,
    itemId: string,
  ) {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const item = await prisma.inventoryItem.findFirst({
      where: { id: itemId, farmId },
    });

    if (!item) throw new AppError("Inventory item not found", 404);

    if (!item.isDeleted) throw new AppError("Item is already active", 400);

    return prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        isDeleted: false,
      },
    });
  }
}

export const inventoryItemService = new InventoryItemService();

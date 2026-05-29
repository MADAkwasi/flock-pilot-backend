import {
  inventoryTransactionDetailSelect,
  inventoryTransactionsListSelect,
} from "../../constants/inventory-transactions.constant.js";
import { prisma } from "../../db/prisma.js";
import AppError from "../../utils/appError.js";
import { farmService } from "../farm/farm.service.js";
import type {
  InventoryTransactionWithDetailSelect,
  InventoryTransactionWithListSelect,
} from "./inventory-transactions.type.js";

class InventoryTransactionService {
  public async getFarmInventoryTransactions(
    farmId: string,
    ownerId: string,
  ): Promise<InventoryTransactionWithListSelect[]> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    return prisma.inventoryTransaction.findMany({
      where: { farmId },
      orderBy: { createdAt: "desc" },
      select: inventoryTransactionsListSelect,
    });
  }

  public async getInventoryItemTransactions(
    farmId: string,
    ownerId: string,
    itemId: string,
  ): Promise<InventoryTransactionWithListSelect[]> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const item = await prisma.inventoryItem.findFirst({
      where: { id: itemId, farmId },
      select: { id: true },
    });

    if (!item) throw new AppError("Inventory item not found", 404);

    return prisma.inventoryTransaction.findMany({
      where: {
        farmId,
        inventoryItemId: itemId,
      },
      orderBy: { createdAt: "desc" },
      select: inventoryTransactionsListSelect,
    });
  }

  public async getInventoryTransactionById(
    farmId: string,
    ownerId: string,
    transactionId: string,
  ): Promise<InventoryTransactionWithDetailSelect> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const transaction = await prisma.inventoryTransaction.findFirst({
      where: {
        id: transactionId,
        farmId,
      },
      select: inventoryTransactionDetailSelect,
    });

    if (!transaction)
      throw new AppError("Inventory transaction not found", 404);

    return transaction;
  }

  public async getFlockInventoryTransactions(
    farmId: string,
    ownerId: string,
    flockId: string,
  ): Promise<InventoryTransactionWithListSelect[]> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const flock = await prisma.flock.findFirst({
      where: { id: flockId, farmId },
      select: { id: true },
    });

    if (!flock) throw new AppError("Flock not found", 404);

    return prisma.inventoryTransaction.findMany({
      where: {
        farmId,
        flockId,
      },
      orderBy: { createdAt: "desc" },
      select: inventoryTransactionsListSelect,
    });
  }
}

export const inventoryTransactionService = new InventoryTransactionService();

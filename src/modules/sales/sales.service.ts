import {
  salesDetailSelect,
  salesListSelect,
} from "../../constants/sales.constant..js";
import { prisma } from "../../db/prisma.js";
import {
  InventoryTransactionType,
  type Sale,
} from "../../generated/prisma/client.js";
import AppError from "../../utils/appError.js";
import { farmService } from "../farm/farm.service.js";
import type { CreateSaleDto, UpdateSaleDto } from "./sales.schema.js";
import type {
  SalesWithDetailSelect,
  SalesWithListSelect,
} from "./sales.type.js";

class SaleService {
  public async createFarmSaleRecord(
    farmId: string,
    ownerId: string,
    salesData: CreateSaleDto,
  ): Promise<Sale> {
    const farm = await prisma.farm.findFirst({
      where: {
        id: farmId,
        ownerId,
      },
      select: {
        id: true,
      },
    });

    if (!farm) throw new AppError("Farm not found", 404);

    return prisma.$transaction(async (tx) => {
      let flockId: string | undefined;

      if (salesData.flockId) {
        const flock = await tx.flock.findFirst({
          where: {
            id: salesData.flockId,
            farmId,
          },
          select: {
            id: true,
          },
        });

        if (!flock) throw new AppError("Flock not found", 404);

        flockId = flock.id;
      }

      const inventoryItem = await tx.inventoryItem.findFirst({
        where: {
          id: salesData.inventoryItemId,
          farmId,
        },
      });

      if (!inventoryItem) throw new AppError("Inventory item not found", 404);

      const saleRecord = await tx.sale.create({
        data: {
          farmId,
          flockId,
          type: salesData.type,
          quantity: salesData.quantity,
          unitPrice: salesData.unitPrice,
          totalAmount: salesData.quantity * salesData.unitPrice,
          customerName: salesData.customerName,
          notes: salesData.notes,
        },
      });

      await tx.inventoryTransaction.create({
        data: {
          farmId,
          flockId,
          inventoryItemId: inventoryItem.id,
          type: InventoryTransactionType.SALE,
          quantity: -salesData.quantity,
          unitCost: salesData.unitPrice,
          notes: `${salesData.type} sale recorded`,
          referenceId: saleRecord.id,
        },
      });

      return saleRecord;
    });
  }

  public async getSalesRecordHistory(
    farmId: string,
    ownerId: string,
    flockId?: string,
  ): Promise<SalesWithListSelect[]> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    if (flockId) {
      const flock = await prisma.flock.findFirst({
        where: {
          id: flockId,
          farmId,
        },
        select: {
          id: true,
        },
      });

      if (!flock) {
        throw new AppError("Flock not found", 404);
      }
    }

    return prisma.sale.findMany({
      where: {
        farmId,
        ...(flockId && { flockId }),
      },
      select: salesListSelect,
      orderBy: {
        soldAt: "desc",
      },
    });
  }

  public async getSaleRecord(
    farmId: string,
    ownerId: string,
    salesId: string,
  ): Promise<SalesWithDetailSelect> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const sale = await prisma.sale.findFirst({
      where: {
        id: salesId,
        farmId,
      },
      select: salesDetailSelect,
    });

    if (!sale) {
      throw new AppError("Sale record not found", 404);
    }

    return sale;
  }

  public async updateSaleRecord(
    farmId: string,
    ownerId: string,
    salesId: string,
    updateData: UpdateSaleDto,
  ): Promise<SalesWithDetailSelect> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    return prisma.$transaction(async (tx) => {
      const existingSale = await tx.sale.findFirst({
        where: {
          id: salesId,
          farmId,
        },
      });

      if (!existingSale) {
        throw new AppError("Sale record not found", 404);
      }

      const inventoryTransaction = await tx.inventoryTransaction.findFirst({
        where: {
          referenceId: existingSale.id,
          type: InventoryTransactionType.SALE,
        },
      });

      if (!inventoryTransaction) {
        throw new AppError("Inventory transaction not found for sale", 404);
      }

      const updatedQuantity = updateData.quantity ?? existingSale.quantity;

      const updatedUnitPrice = updateData.unitPrice ?? existingSale.unitPrice;

      const updatedSaleType = updateData.type ?? existingSale.type;

      const updatedCustomerName =
        updateData.customerName ?? existingSale.customerName;

      const updatedNotes = updateData.notes ?? existingSale.notes;

      const updatedFlockId = updateData.flockId ?? existingSale.flockId;

      const quantityChanged = updatedQuantity !== existingSale.quantity;

      if (quantityChanged) {
        const delta = updatedQuantity - existingSale.quantity;

        await tx.inventoryTransaction.create({
          data: {
            farmId,
            flockId: updatedFlockId ?? undefined,
            inventoryItemId: inventoryTransaction.inventoryItemId,

            type: InventoryTransactionType.ADJUSTMENT,
            quantity: -delta,
            unitCost: updatedUnitPrice,
            notes: "Sale quantity adjustment",

            referenceId: existingSale.id,
          },
        });
      }

      await tx.sale.update({
        where: {
          id: salesId,
        },
        data: {
          type: updatedSaleType,
          quantity: updatedQuantity,
          unitPrice: updatedUnitPrice,

          totalAmount: updatedQuantity * updatedUnitPrice,

          customerName: updatedCustomerName,

          notes: updatedNotes,

          flockId: updatedFlockId,
        },
      });

      const updatedSale = await tx.sale.findFirst({
        where: {
          id: salesId,
          farmId,
        },
        select: salesDetailSelect,
      });

      if (!updatedSale) {
        throw new AppError("Updated sale record not found", 500);
      }

      return updatedSale;
    });
  }

  public async deleteSaleRecord(
    farmId: string,
    ownerId: string,
    salesId: string,
  ): Promise<boolean> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({
        where: {
          id: salesId,
          farmId,
        },
      });

      if (!sale) throw new AppError("Sale record not found", 404);

      const inventoryTransaction = await tx.inventoryTransaction.findFirst({
        where: {
          referenceId: sale.id,
          type: InventoryTransactionType.SALE,
        },
      });

      if (!inventoryTransaction)
        throw new AppError("Inventory transaction not found", 404);

      await tx.inventoryTransaction.create({
        data: {
          farmId,
          flockId: sale.flockId ?? undefined,
          inventoryItemId: inventoryTransaction.inventoryItemId,

          type: InventoryTransactionType.ADJUSTMENT,
          quantity: sale.quantity,
          unitCost: sale.unitPrice,
          notes: "Reversal of deleted sale",
        },
      });

      await tx.sale.delete({
        where: {
          id: salesId,
        },
      });

      return true;
    });
  }
}

export const saleService = new SaleService();

import {
  expensesDetailSelect,
  expensesListSelect,
} from "../../constants/expenses.constant.js";
import { prisma } from "../../db/prisma.js";
import type { Expense } from "../../generated/prisma/client.js";
import {
  ExpenseCategory,
  ExpenseType,
  InventoryTransactionType,
} from "../../generated/prisma/enums.js";
import AppError from "../../utils/appError.js";
import { farmService } from "../farm/farm.service.js";
import type { CreateExpenseDto, UpdateExpenseDto } from "./expenses.schema.js";
import type {
  ExpensesWithDetailSelect,
  ExpensesWithListSelect,
} from "./expenses.type.js";

class ExpenseService {
  public async getFarmExpenses(
    farmId: string,
    ownerId: string,
    flockId?: string,
  ): Promise<ExpensesWithListSelect[]> {
    const farm = await farmService.ensureOwnedFarm(farmId, ownerId);

    if (flockId) {
      const flock = await prisma.flock.findFirst({
        where: {
          id: flockId,
          farmId: farm.id,
        },
      });

      if (!flock) throw new AppError("Flock not found", 404);
    }

    return prisma.expense.findMany({
      where: {
        farmId: farm.id,
        ...(flockId && { flockId }),
      },
      select: expensesListSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  public async getExpense(
    farmId: string,
    ownerId: string,
    expenseId: string,
  ): Promise<ExpensesWithDetailSelect> {
    const farm = await farmService.ensureOwnedFarm(farmId, ownerId);

    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        farmId: farm.id,
      },
      select: expensesDetailSelect,
    });

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    return expense;
  }

  public async createExpense(
    farmId: string,
    ownerId: string,
    data: CreateExpenseDto,
  ): Promise<Expense> {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    const flockRequiredCategories: ExpenseCategory[] = [
      ExpenseCategory.FEED,
      ExpenseCategory.MEDICATION,
    ];

    const inventoryAffectingCategories: ExpenseCategory[] = [
      ExpenseCategory.FEED,
      ExpenseCategory.MEDICATION,
      ExpenseCategory.EQUIPMENT,
      ExpenseCategory.INVENTORY,
    ];

    if (flockRequiredCategories.includes(data.category) && !data.flockId) {
      throw new AppError(`${data.category} requires a flock`, 400);
    }

    return prisma.$transaction(async (tx) => {
      const flock = data.flockId
        ? await tx.flock.findFirst({
            where: { id: data.flockId, farmId },
          })
        : null;

      if (data.flockId && !flock) {
        throw new AppError("Flock not found", 404);
      }

      const expense = await tx.expense.create({
        data: {
          farmId,
          flockId: flock?.id,
          type: data.type,
          category: data.category,
          amount: data.amount,
          description: data.description,
        },
      });

      if (!inventoryAffectingCategories.includes(data.category)) return expense;

      if (!data.inventoryItemId)
        throw new AppError("Inventory item is required", 400);

      const inventoryItem = await tx.inventoryItem.findFirst({
        where: {
          id: data.inventoryItemId,
          farmId,
        },
      });

      if (!inventoryItem) throw new AppError("Inventory item not found", 404);

      const quantity = data.quantity ?? 0;

      if (data.type === ExpenseType.PURCHASE) {
        await tx.inventoryTransaction.create({
          data: {
            farmId,
            flockId: flock?.id,
            inventoryItemId: inventoryItem.id,
            type: InventoryTransactionType.PURCHASE,
            quantity,
            unitCost: quantity > 0 ? data.amount / quantity : undefined,
            notes: data.description ?? "Purchase via expense",
            referenceId: expense.id,
          },
        });
      }

      if (data.type === ExpenseType.LOSS) {
        await tx.inventoryTransaction.create({
          data: {
            farmId,
            flockId: flock?.id,
            inventoryItemId: inventoryItem.id,
            type: InventoryTransactionType.LOSS,
            quantity,
            unitCost: quantity > 0 ? data.amount / quantity : undefined,
            notes: data.description ?? "Loss via expense",
            referenceId: expense.id,
          },
        });
      }

      return expense;
    });
  }

  public async updateExpense(
    farmId: string,
    ownerId: string,
    expenseId: string,
    data: UpdateExpenseDto,
  ): Promise<ExpensesWithDetailSelect> {
    const farm = await farmService.ensureOwnedFarm(farmId, ownerId);

    return prisma.$transaction(async (tx) => {
      const existing = await tx.expense.findFirst({
        where: { id: expenseId, farmId: farm.id },
      });

      if (!existing) {
        throw new AppError("Expense not found", 404);
      }

      const relatedTx = await tx.inventoryTransaction.findMany({
        where: { referenceId: existing.id },
      });

      for (const t of relatedTx) {
        await tx.inventoryTransaction.create({
          data: {
            farmId: existing.farmId,
            flockId: existing.flockId,
            inventoryItemId: t.inventoryItemId,

            type: InventoryTransactionType.ADJUSTMENT,

            quantity: -t.quantity, // ✅ TRUE reversal

            unitCost: t.unitCost,
            notes: "Reversal due to expense update",

            referenceId: existing.id,
          },
        });
      }

      const updated = await tx.expense.update({
        where: { id: expenseId },
        data: {
          type: data.type ?? existing.type,
          category: data.category ?? existing.category,
          amount: data.amount ?? existing.amount,
          description: data.description ?? existing.description,
          flockId: data.flockId !== undefined ? data.flockId : existing.flockId,
        },
        select: expensesDetailSelect,
      });

      return updated;
    });
  }

  public async deleteExpense(
    farmId: string,
    ownerId: string,
    expenseId: string,
  ): Promise<boolean> {
    const farm = await farmService.ensureOwnedFarm(farmId, ownerId);

    return prisma.$transaction(async (tx) => {
      const expense = await tx.expense.findFirst({
        where: { id: expenseId, farmId: farm.id },
      });

      if (!expense) {
        throw new AppError("Expense not found", 404);
      }

      const inventoryTxs = await tx.inventoryTransaction.findMany({
        where: {
          referenceId: expense.id,
        },
      });

      for (const txItem of inventoryTxs) {
        await tx.inventoryTransaction.create({
          data: {
            farmId: expense.farmId,
            flockId: expense.flockId,
            inventoryItemId: txItem.inventoryItemId,

            type: InventoryTransactionType.REVERSAL,

            quantity: txItem.quantity,

            unitCost: txItem.unitCost,

            notes: "Reversal of deleted expense",

            referenceId: expense.id,
          },
        });
      }

      await tx.expense.delete({
        where: { id: expense.id },
      });

      return true;
    });
  }
}

export const expenseService = new ExpenseService();

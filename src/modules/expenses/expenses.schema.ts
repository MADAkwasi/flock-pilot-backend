import z from "zod";
import { ExpenseCategory, ExpenseType } from "../../generated/prisma/enums.js";

export const createExpenseSchema = z
  .object({
    flockId: z.uuid().optional(),
    inventoryItemId: z.uuid().optional(),
    type: z.enum(ExpenseType),
    category: z.enum(ExpenseCategory),
    amount: z.number(),
    quantity: z.number().optional(),
    description: z.string().optional(),
  })
  .strict();

export const updateExpenseSchema = z
  .object({
    flockId: z.uuid().optional(),
    inventoryItemId: z.uuid().optional(),
    type: z.enum(ExpenseType).optional(),
    category: z.enum(ExpenseCategory).optional(),
    amount: z.number().optional(),
    quantity: z.number().optional(),
    description: z.string().optional(),
  })
  .strict();

export const expenseParamSchema = z
  .object({
    farmId: z.uuid(),
    expenseId: z.uuid(),
  })
  .strict();

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;

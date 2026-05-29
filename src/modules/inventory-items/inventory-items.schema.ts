import z from "zod";
import { InventoryCategory } from "../../generated/prisma/enums.js";

export const createInventoryItemSchema = z
  .object({
    name: z.string(),
    category: z.enum(InventoryCategory),
    unit: z.string(),
    openingStock: z.number().optional(),
    reorderLevel: z.number().optional(),
    costPerUnit: z.number().optional(),
  })
  .strict();

export const updateInventoryItemSchema = z
  .object({
    name: z.string().optional(),
    category: z.enum(InventoryCategory).optional(),
    unit: z.string().optional(),
    reorderLevel: z.number().optional(),
    costPerUnit: z.number().optional(),
  })
  .strict();

export const clearInventoryItemSchema = z
  .object({
    reason: z.string().optional(),
  })
  .strict();

export const adjustInventoryItemSchema = z
  .object({
    newQuantity: z.number(),
    reason: z.string().optional(),
  })
  .strict();

export const inventoryItemParamSchema = z
  .object({
    farmId: z.uuid(),
    inventoryItemId: z.uuid(),
  })
  .strict();

export type CreateInventoryItemDto = z.infer<typeof createInventoryItemSchema>;
export type CLearInventoryItemDto = z.infer<typeof clearInventoryItemSchema>;
export type AdjustInventoryItemDto = z.infer<typeof adjustInventoryItemSchema>;
export type UpdateInventoryItemDto = z.infer<typeof updateInventoryItemSchema>;

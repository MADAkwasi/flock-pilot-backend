import z from "zod";
import { SaleType } from "../../generated/prisma/enums.js";

export const createSaleSchema = z
  .object({
    type: z.enum(SaleType),
    quantity: z.number().min(1),
    unitPrice: z.number().min(1),
    flockId: z.uuid().optional(),
    inventoryItemId: z.uuid(),
    customerName: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

export const updateSaleSchema = z
  .object({
    type: z.enum(SaleType).optional(),
    quantity: z.number().min(1).optional(),
    unitPrice: z.number().min(1).optional(),
    flockId: z.uuid().optional(),
    customerName: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

export const queryParamSchema = z
  .object({
    flockId: z.uuid().optional(),
  })
  .strict();

export const salesParamSchema = z
  .object({
    salesId: z.uuid(),
    farmId: z.uuid(),
  })
  .strict();

export type CreateSaleDto = z.infer<typeof createSaleSchema>;
export type UpdateSaleDto = z.infer<typeof updateSaleSchema>;

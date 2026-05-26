import z from "zod";

export const createEggProductionSchema = z
  .object({
    count: z.number().min(1),
    broken: z.number().min(0).optional(),
  })
  .strict();

export const updateEggProductionSchema = z
  .object({
    count: z.number().min(1).optional(),
    broken: z.number().min(0).optional(),
  })
  .strict();

export const eggProductionParamSchema = z
  .object({
    flockId: z.uuid(),
    productionId: z.uuid(),
  })
  .strict();

export type EggProductionDto = z.infer<typeof createEggProductionSchema>;
export type UpdateEggProductionDto = z.infer<typeof updateEggProductionSchema>;

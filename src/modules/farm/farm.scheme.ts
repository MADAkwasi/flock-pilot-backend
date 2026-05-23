import z from "zod";

export const createFarmSchema = z
  .object({
    name: z.string().min(3),
    location: z.string().min(3).optional(),
    description: z.string().min(5).optional(),
    farmType: z.enum(["BROILER", "LAYER", "MIXED"]).optional(),
  })
  .strict();

export const updateFarmBodySchema = z
  .object({
    name: z.string().min(3).optional(),
    location: z.string().min(3).optional(),
    description: z.string().min(5).optional(),
    farmType: z.enum(["BROILER", "LAYER", "MIXED"]).optional(),
  })
  .strict();

export const farmParamSchema = z.object({
  farmId: z.uuid(),
});

// Dedicated param validator
export const farmParamsSchema = z.object({
  farmId: z.uuid(),
});

export type CreateFarmDto = z.infer<typeof createFarmSchema>;
export type UpdateFarmDto = z.infer<typeof updateFarmBodySchema>;

import z from "zod";

export const createFlockSchema = z
  .object({
    name: z.string().min(3),
    breed: z.string().optional(),
    flockType: z.enum(["LAYER", "BROILER"]),
    farmId: z.uuid(),
    initialCount: z.number(),
    source: z.string().min(3).optional(),
    startDate: z.coerce.date(),
  })
  .strict();

export const updateFlockSchema = z
  .object({
    name: z.string().min(3).optional(),
    breed: z.string().min(3).optional(),
    source: z.string().min(3).optional(),
    startDate: z.coerce.date().optional(),
  })
  .strict();

export const updateFlockStatusSchema = z
  .object({
    status: z.enum(["ACTIVE", "SOLD", "ARCHIVED"]),
  })
  .strict();

export const flockParamsSchema = z.object({
  flockId: z.uuid(),
});

export type FlockStatusDto = z.infer<typeof updateFlockStatusSchema>;
export type FlockUpdateDto = z.infer<typeof updateFlockSchema>;
export type FlockDto = z.infer<typeof createFlockSchema>;

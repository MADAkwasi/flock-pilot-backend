import z from "zod";

export const createFarmSchema = z.object({
  name: z.string().min(3),
  location: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  farmType: z.enum(["BROILER", "LAYER", "MIXED"]).optional(),
});

export type CreateFarmDto = z.infer<typeof createFarmSchema>;

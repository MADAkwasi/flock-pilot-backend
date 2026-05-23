import z from "zod";
import { Severity } from "../../../generated/prisma/enums.js";

export const createHealthRecordSchema = z
  .object({
    diagnosis: z.string().min(2),
    severity: z.enum(Severity),
    treatment: z.string().optional(),
    medication: z.string().optional(),
    affectedCount: z.number().optional(),
    vetNotes: z.string().optional(),
    recordedAt: z.coerce.date(),
  })
  .strict();

export const healthRecordParamSchema = z.object({
  flockId: z.uuid(),
  healthRecordId: z.uuid(),
});

export type HealthRecordDto = z.infer<typeof createHealthRecordSchema>;

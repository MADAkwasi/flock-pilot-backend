import { z } from "zod";

export const askAssistantSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message is too long"),
});

export type AskAssistantDto = z.infer<typeof askAssistantSchema>;

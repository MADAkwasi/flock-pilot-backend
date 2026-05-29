import Groq from "groq-sdk";
import { env } from "./env.js";

export enum GropRoles {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export const client = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export async function getAiResponse(
  messages: {
    role: GropRoles;
    content: string;
  }[],
): Promise<string> {
  const response = await client.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_completion_tokens: 1024,
  });

  return response.choices[0]?.message?.content ?? "No response granted.";
}

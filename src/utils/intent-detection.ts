import { client } from "../config/groq.js";
import { AiIntent } from "../modules/ai-assistant/ai-assistant.type.js";

export async function detectIntentWithLLM(message: string): Promise<AiIntent> {
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",

    temperature: 0,

    max_completion_tokens: 20,

    messages: [
      {
        role: "system",
        content: `
You are an intent classification engine for a poultry farming system.

Classify the user's message into ONLY ONE of these intents:

- INVENTORY
- FLOCK
- FINANCE
- HEALTH
- GENERAL

Rules:
- INVENTORY → stock, feed, inventory, restocking, supplies
- FLOCK → birds, egg production, flock performance, mortality
- FINANCE → expenses, profit, revenue, sales, costs
- HEALTH → disease, symptoms, medication, treatment
- GENERAL → greetings or anything else

Respond ONLY with the intent label.
        `,
      },

      {
        role: "user",
        content: message,
      },
    ],
  });

  const intent = response.choices[0]?.message?.content?.trim();

  switch (intent) {
    case "INVENTORY":
      return AiIntent.INVENTORY;

    case "FLOCK":
      return AiIntent.FLOCK;

    case "FINANCE":
      return AiIntent.FINANCE;

    case "HEALTH":
      return AiIntent.HEALTH;

    default:
      return AiIntent.GENERAL;
  }
}

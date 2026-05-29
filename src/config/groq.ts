import Groq from "groq-sdk";
import { env } from "./env.js";

const client = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export async function getAiResponse(content: string) {
  const response = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return response.choices;
}

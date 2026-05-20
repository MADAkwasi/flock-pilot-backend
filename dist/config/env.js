import "dotenv/config.js";
import { z } from "zod";
const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    DATABASE_URL: z.string().min(1),
    //   JWT_SECRET: z.string().min(1),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables", parsed.error.format());
    process.exit(1);
}
export const env = {
    PORT: Number(process.env.PORT ?? 5000),
    DATABASE_URL: process.env.DATABASE_URL ?? "",
};
//# sourceMappingURL=env.js.map
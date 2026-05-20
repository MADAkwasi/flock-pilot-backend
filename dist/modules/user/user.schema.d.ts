import z from "zod";
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.z.core.$strip>;
export type RegisterDto = z.infer<typeof registerSchema>;
//# sourceMappingURL=user.schema.d.ts.map
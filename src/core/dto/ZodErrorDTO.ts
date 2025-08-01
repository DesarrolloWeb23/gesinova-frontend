import { z } from "zod";

export const ZodErrorDto = z.object({
    name: z.string(),
    message: z.string(),
    errors: z.array(z.object({
        message: z.string(),
    })),
});

export type ZodError = z.infer<typeof ZodErrorDto>;

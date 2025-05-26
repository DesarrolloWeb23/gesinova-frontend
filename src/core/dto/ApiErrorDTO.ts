import { z } from "zod";

export const ApiErrorDTO = z.object({
    path: z.string(),
    error: z.string(),
    message: z.string(),
    timestamp: z.string(),
    status: z.union([z.string(), z.number()]), // algunos backends devuelven string, otros número
});

export type ApiError = z.infer<typeof ApiErrorDTO>;

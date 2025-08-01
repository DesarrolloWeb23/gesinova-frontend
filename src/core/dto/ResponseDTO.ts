import { z } from "zod";

export const ResponseDTO = z.object({
    data: z.array(z.any()).optional(),
    error: z.string().optional(),
});
import { z } from "zod";

export const ResponseErrorDTO  = z.object({
    data: z.object({
        status: z.number().optional(),
        message: z.string().optional()
    }).optional()
});

export type ResponseError = z.infer<typeof ResponseErrorDTO >;
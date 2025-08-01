import { z } from 'zod'

export const ApiResponseDTO = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        status: z.number(),
        message: z.string(),
        data: dataSchema,
    });
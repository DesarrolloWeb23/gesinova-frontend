import { z } from 'zod'

export const ClassificationAttentionDTO = z.object({
    content: z.array(
        z.object({
            id: z.number(),
            internalCode: z.string(),
            description: z.string(),
            attentionType: z.string().nullable()
        })
    )
});
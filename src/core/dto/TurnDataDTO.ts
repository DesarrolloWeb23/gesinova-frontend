import { z } from "zod";

export const TurnDataDTO = z.object({
    content: z.array(
        z.object({
            id: z.number(),
            turnCode: z.string().min(2).max(100),
            identificationType: z.string().max(50),
            identificationNumber: z.string().max(50),
            firstName: z.string().min(2).max(100),
            lastName: z.string().min(2).max(100),
            userProcess: z.string().nullable(),
            state: z.object({
                code: z.number(),
                label: z.string().min(2).max(100)
            }),
            attentionService: z.object({
                id: z.number(),
                internalCode: z.string().min(1).max(100),
                name: z.string().min(2).max(100),
                swActive: z.object({
                    code: z.number(),
                    label: z.string().min(2).max(100)
                }),
                module: z.object(
                    {
                        id: z.number(),
                        internalCode: z.string().min(2).max(10),
                        name: z.string().min(5).max(100),
                        swActive: z.object({
                            code: z.number(),
                            label: z.string().min(2).max(100)
                        }),
                    }
                )
            }),
            classificationAttention: z.object({
                id: z.number(),
                internalCode: z.string().min(1).max(100),
                description: z.string().min(2).max(100),
                attentionType: z.object({
                    id: z.number(),
                    description: z.string().min(2).max(100)
                }),
            }),
            headQuarter: z.string().min(2).max(100),
        })
    )
});
import { z } from "zod";

export const AttentionModulesDTO = z.object({
    content: z.array(
        z.object({
            id: z.number(),
            internalCode: z.string().min(1).max(100),
            name: z.string().min(2).max(100),
            swActive: z.object({
                code: z.number(),
                label: z.string().min(2).max(100),
            }),
            module: z.object({
                id: z.number(),
                internalCode: z.string().min(2).max(100),
                name: z.string().min(2).max(100),
                swActive: z.object({
                    code: z.number(),
                    label: z.string().min(2).max(100),
                }),
            }),
        })
    ),
});

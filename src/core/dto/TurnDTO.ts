import { z } from 'zod'

export const TurnDTO = z.object({
    id: z.number(),
    turnCode: z.string().min(2).max(100),
    identificationType: z.string().max(50),
    identificationNumber: z.string().max(50),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    state: z.object({
        code: z.number(),
        label: z.string().min(2).max(100)
    })
});
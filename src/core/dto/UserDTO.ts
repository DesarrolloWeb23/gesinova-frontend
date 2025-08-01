import { date,z } from 'zod'

export const UserDTO = z.object({
    accessToken : z.string().optional(),
    expiresAt : z.string().optional(),
    mfaRequired : z.boolean(),
    mfaVerified : z.boolean(),
    firstLogin : z.boolean(),
    qrUri: z.string().optional(),
    tempToken: z.string().optional(),
    user: z.object({
            id: z.number(), 
            username: z.string().min(2).max(100),
            name: z.string().min(2).max(100),
            lastName: z.string().min(2).max(100),
            email: z.string().email().nullable(),
            swAdmin: z.string().min(2).max(3),
            swActive: z.string().min(2).max(3),
            dateJoined: date().nullable(),
            groups: z.array(z.object({
                id: z.number(),
                name: z.string().min(2).max(100),
            })),
            permissions: z.array(z.object({
                id: z.number(),
                codename: z.string(),
                name: z.string(),
            })),
            mfaActive: z.boolean().optional(),
            mfaRequired: z.boolean().optional(),
        }
    ).optional(),
});

export type User = z.infer<typeof UserDTO>;
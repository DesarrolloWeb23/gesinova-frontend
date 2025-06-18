import { z } from 'zod'

export const UserDTO = z.object({
    refreshToken : z.string(),
    accessToken : z.string(),
    expiresAt : z.string(),
    mfaRequired : z.boolean(),
    mfaVerified : z.boolean(),
    firstLogin : z.boolean(),
    qrUri: z.string().optional(),
    tempToken: z.string(),
    user: z.object({
        id: z.number(),
        password: z.string(),
        last_login: z.string(),
        is_superuser: z.boolean(),
        username: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        is_staff: z.boolean(),
        is_active: z.boolean(),
        accessToken: z.string(),
        refreshToken: z.string(),
        }
    ),
})

export const UsersResponse = z.array(UserDTO)

export type User = z.infer<typeof UserDTO>
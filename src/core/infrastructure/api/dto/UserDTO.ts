import { z } from 'zod'

export const UserDTO = z.object({
    id: z.number(),
    password: z.string(),
    last_login: z.string(),
    is_superuser: z.boolean(),
    username: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    is_staff: z.boolean(),
    is_active: z.boolean()
})

export const UsersResponse = z.array(UserDTO)

export type User = z.infer<typeof UserDTO>
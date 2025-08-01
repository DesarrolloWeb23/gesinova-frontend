import { z } from "zod"

export const PermissionsDTO = z.array(z.object({
    id: z.number(),
    codename: z.string(),
    name: z.string(),
}))

export type Permissions = z.infer<typeof PermissionsDTO>


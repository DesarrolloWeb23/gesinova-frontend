import { z } from "zod";

export const GroupsDTO = z.array(z.object({
    id: z.number(),
    name: z.string(),
    permissions: z.array(z.object({
        id: z.number(),
        codename: z.string(),
        name: z.string(),
    })),
}))

export type Groups = z.infer<typeof GroupsDTO>;
import { z } from "zod";

export const GroupDTO = z.object({
    id: z.number(),
    name: z.string(),
    permissions: z.array(z.object({
        id: z.number(),
        codename: z.string(),
        name: z.string(),
    })).optional(),
});

export type Group = z.infer<typeof GroupDTO>;
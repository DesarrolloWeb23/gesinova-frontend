import { z } from "zod";

export const UsersDataDTO = z.object({
    content: z.array(
        z.object({
            id: z.number(),
            username: z.string().min(2).max(100),
            name: z.string().min(2).max(100),
            lastName: z.string().min(2).max(100),
            email: z.string().nullable(),
            swAdmin: z.string().min(2).max(3),
            swActive: z.string().min(2).max(3),
            dateJoined: z.string().nullable(), 
            groups: z.array(z.object({
                id: z.number(),
                name: z.string().min(2).max(100),
            })),
            permissions: z.array(z.object({
                id: z.number(),
                codename: z.string(),
                name: z.string(),
            })),
        })
    ),
});

export type UsersData = z.infer<typeof UsersDataDTO>;
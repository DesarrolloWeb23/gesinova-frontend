import { z } from "zod";

export const AuthEnableMfaDTO = z.object({
    qrUri: z.string().url().optional(),
    secretKey: z.string().optional(),
    tempToken: z.string().optional()
});
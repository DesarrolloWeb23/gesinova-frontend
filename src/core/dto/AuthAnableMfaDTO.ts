import { z } from "zod";

export const AuthEnableMfaDTO = z.object({
    qrUri: z.string().url(),
    secretKey: z.string(),
    tempToken: z.string()
});
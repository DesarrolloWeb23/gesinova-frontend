import { z } from "zod";

export const ApiResponseDTO  = z.object({
    status: z.string() || z.number(),
    message: z.string(),
    path: z.string(),
    data: z.string() 
});

export type ApiResponse = z.infer<typeof ApiResponseDTO >;
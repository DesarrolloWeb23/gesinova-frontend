// Este archivo contiene la lógica para autenticar a un usuario y manejar errores de autenticación
import { z } from 'zod'

// DTO genérico
export const BaseResponseDTO = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status:  z.number(),
    message: z.string(),
    path: z.string(),
    timestamp: z.string().optional().nullable(),
    error: z.string().optional().nullable(),
    data: dataSchema,
  });
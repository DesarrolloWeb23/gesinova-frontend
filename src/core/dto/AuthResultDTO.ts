import { z } from 'zod';
import { UserDTO } from './UserDTO';
import { BaseResponseDTO } from './BaseResponseDTO';

// DTO de respuesta genérico
export const AuthResultDTO = BaseResponseDTO(UserDTO);

// Tipado
export type AuthResult = z.infer<typeof AuthResultDTO>;
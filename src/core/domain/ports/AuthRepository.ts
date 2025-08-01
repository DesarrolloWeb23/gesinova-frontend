import { z } from "zod";
import { UserDTO } from "@/core/dto/UserDTO";
import { BaseResponseDTO } from '@/core/dto/BaseResponseDTO';
import { ResponseDTO } from '@/core/dto/ResponseDTO';
import { AuthEnableMfaDTO } from "@/core/dto/AuthAnableMfaDTO";

export type AuthApiResponse = z.infer<ReturnType<typeof BaseResponseDTO<typeof UserDTO>>>;
export type LogoutApiResponse = z.infer<ReturnType<typeof BaseResponseDTO<typeof ResponseDTO>>>;
export type AuthEnableResponse = z.infer<ReturnType<typeof BaseResponseDTO<typeof AuthEnableMfaDTO>>>;
export type ResetPasswordApiResponse = z.infer<ReturnType<typeof BaseResponseDTO<typeof ResponseDTO>>>;
export interface AuthRepository {
    login(username: string, password: string): Promise<AuthApiResponse>,
    enableMFA(id: number, method: number):  Promise<AuthEnableResponse>,
    validateMFA(tokenTemp: string | null, code: string): Promise<AuthApiResponse>,
    test(): Promise<AuthApiResponse>,
    logout(): Promise<LogoutApiResponse>,
    resetPassword(email: string): Promise<ResetPasswordApiResponse>,
}
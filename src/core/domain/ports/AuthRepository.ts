import { AuthResult } from "@/core/dto/AuthResultDTO";

export interface AuthRepository {
    login(username: string, password: string): Promise<AuthResult>,
    enableMFA(id: number, method: number):  Promise<AuthResult>,
    validateMFA(tokenTemp: string | null, code: string): Promise<AuthResult>
    test(): Promise<AuthResult>;
}
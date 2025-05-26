import { AuthRepository } from "../ports/AuthRepository";
import { AuthResult } from "@/core/dto/AuthResultDTO";

export class ActivateTwoFactor {
    constructor(private authRepository: AuthRepository) {}

    async execute(userId: number, method: number): Promise<AuthResult> {
        try {
            const response = await this.authRepository.enableMFA(userId, method);

            if (method === 1) {
                return {
                    status: "TOPT_ACTIVATED",
                    path: "/activate-totp",
                    message: "Segundo factor activado con código QR",
                    data: response.data
                };
            } else if (method === 2) {
                return {
                    status: "OPT_ACTIVATED",
                    path: "/activate-opt",
                    message: "Se ha enviado un correo con el código de activación",
                    data: response.data
                };
            }

            return response;
        } catch (error) {
            throw error;
        }
    }
}
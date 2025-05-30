import { AuthRepository } from "../ports/AuthRepository";
import { AuthResult } from "@/core/dto/AuthResultDTO";
import { getMessage } from "@/core/domain/messages";

export class ActivateTwoFactor {
    constructor(private authRepository: AuthRepository) {}

    async execute(userId: number, method: number): Promise<AuthResult> {
        try {
            const response = await this.authRepository.enableMFA(userId, method);

            if (method === 1) {
                return {
                    status: "TOPT_ACTIVATED",
                    path: "/activate-totp",
                    message: getMessage("success", "mfa_qr_code"),
                    data: response.data
                };
            } else if (method === 2) {
                return {
                    status: "OPT_ACTIVATED",
                    path: "/activate-opt",
                    message: getMessage("success", "mfa_code_sent"),
                    data: response.data
                };
            }

            return response;
        } catch (error) {
            throw error;
        }
    }
}
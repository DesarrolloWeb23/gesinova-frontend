import { AuthRepository } from "../ports/AuthRepository";
import { AuthResult } from "@/core/dto/AuthResultDTO";
import { ResponseError } from "@/core/dto/ResponseErrorDTO";
import { getMessage } from "@/core/domain/messages";

export class ActivateTwoFactor {
    constructor(private authRepository: AuthRepository) {}

    async execute(userId: number, method: number): Promise<AuthResult> {
        try {
            const response = await this.authRepository.enableMFA(userId, method);

            if (method === 1) {
                return {
                    status: 200,
                    path: "/activate-totp",
                    message: "TOPT_ACTIVATED",
                    data: response.data
                };
            } else if (method === 2) {
                return {
                    status: 200,
                    path: "/activate-opt",
                    message: "OPT_ACTIVATED",
                    data: response.data
                };
            }

            return response;
        } catch (err) {
            const error = err as ResponseError;
            if (error?.data?.status === 400) {
                throw {
                    status: 400,
                    message: getMessage("errors", "activate_mfa_invalid_method")
                }
            } else {
                throw {
                    status: "ACCESS_ERROR",
                    message: error?.data?.message || getMessage("errors", "activate_mfa_error")
                }
            }
        }
    }
}
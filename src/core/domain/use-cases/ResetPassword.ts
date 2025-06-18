import { AuthRepository } from "@/core/domain/ports/AuthRepository";
import { AuthResult } from "@/core/dto/AuthResultDTO";
import { ResponseError } from "@/core/dto/ResponseErrorDTO";
import { getMessage } from "@/core/domain/messages";

export class ResetPassword {
    
    constructor(private authRepository: AuthRepository) {}

    async execute(mail: string): Promise<AuthResult> {
        try {
            const response = await this.authRepository.resetPassword(mail);

            if (response.status === 200) {
                return {
                    status: 200,
                    path: "/reset-password-success",
                    message: "RESET_PASSWORD_SUCCESS",
                    data: response.data,
                }
            }
            return response;
        } catch (err) {
            const error = err as ResponseError;
            if (error?.data?.status === 404) {
                throw {
                    status: "USER_NOT_FOUND",
                    message: getMessage("errors", "user_not_found")
                }
            } else {
                throw {
                    status: "RESET_PASSWORD_ERROR",
                    message: error?.data?.message || getMessage("errors", "reset_password_error")
                }
            }
        }
    }
}
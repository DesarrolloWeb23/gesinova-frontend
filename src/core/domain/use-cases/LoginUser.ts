import { AuthRepository } from "@/core/domain/ports/AuthRepository";
import { AuthResult } from "@/core/dto/AuthResultDTO";


export class LoginUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(username: string, password: string): Promise<AuthResult> {
        try {
                const response = await this.authRepository.login(username, password);
                //response.data.firstLogin = true;

                if (response.data.mfaRequired === false && response.data.firstLogin) {
                    return {
                    status: "ACTIVATE_MFA",
                    path: "/activate-mfa",
                    message: "Multi-factor authentication required.",
                    data: response.data,
                    };
                }

                if (response.data.mfaRequired === false && !response.data.firstLogin) {
                    return {
                        status: "MFA_INHABILITATED",
                        path: "/",
                        message: "Multi-factor authentication not enabled.",
                        data: response.data,
                    };
                }

                if (response.data.mfaRequired === true) {
                    return {
                        status: "MFA_REQUIRED",
                        path: "/required-mfa",
                        message: "Multi-factor authentication required.",
                        data: response.data,
                    };
                }

                return response;
            } catch (error) {
                throw error;
            }
        }
    }

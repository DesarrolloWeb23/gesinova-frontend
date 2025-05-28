import { AuthRepository } from "@/core/domain/ports/AuthRepository";
import { AuthResult } from "@/core/dto/AuthResultDTO";
import { ResponseError } from "@/core/dto/ResponseErrorDTO";


export class LoginUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(username: string, password: string): Promise<AuthResult> {
        try {
                const response = await this.authRepository.login(username, password);

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
            } catch (err) {
                const error = err as ResponseError;
                if (error?.data?.status === 403) {
                    throw {
                        status: "ACCESS_DENIED",
                        message: "Acceso denegado. Usuario o contraseña incorrectas."
                    }
                } else {
                    throw {
                        status: "ACCESS_ERROR",
                        message: error?.data?.message || "Error no manejado al iniciar sesión."
                    }
                }
            }
        }
    }

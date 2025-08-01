import { AuthRepository } from "@/core/domain/ports/AuthRepository";
import { Error } from "@/core/domain/models/Error";
import { Response } from "@/core/domain/models/Response";

export class ResetPassword {
    
    constructor(private authRepository: AuthRepository) {}

    async execute(mail: string): Promise<Response> {
        try {
            const response = await this.authRepository.resetPassword(mail);

            if (response.status === 200) {
                return {
                    status: 200,
                    path: "/reset-password-success",
                    message: "RESET_PASSWORD_SUCCESS",
                }
            }

            return {
                status: response.status,
                path: response.path,
                message: response.message,
            }
        } catch (err) {
            const error = err as Error;
            if (error.type === "api") {
                if(error.status === 403) {
                    throw {
                        status: "ACCESS_DENIED",
                        message: error.message,
                    };
                } else if (error.status === 400) {
                    throw {
                        status: "VALIDATION_ERROR",
                        message: error.message,
                    };
                } else if (error.status === 429) {
                    throw {
                        status: "TOO_MANY_REQUESTS",
                        message: error.message,
                    };
                } else if (error.status === 404) {
                    throw {
                        status: "NOT_FOUND",
                        message: error.message,
                    };
                }
            }
            if (error.type === "validation") {
                throw {
                    status: "VALIDATION_ERROR",
                    message: "La estructura de datos recibida no es válida.",
                };
            }
            if (error.type === "unknown_api_error") {
                throw {
                    status: "UNKNOWN_API_ERROR",
                    message: "La estructura de error de la API no es válida.",
                };
            }
            throw {
                status: "UNKNOWN_ERROR",
                message: "Error de red",
            };
        }
    }
}
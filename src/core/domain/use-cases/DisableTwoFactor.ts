import { Error as AppError } from "@/core/domain/models/Error";
import { AuthEnableResponse, AuthRepository } from "@/core/domain/ports/AuthRepository";

export class DisableTwoFactor {
    constructor(private authRepository: AuthRepository) {}

    async execute(): Promise<AuthEnableResponse> {
        try {
            const response = await this.authRepository.disableMFA();
            return response;
        } catch (err) {
            const error = err as AppError;
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
                } else if (error.status === 401) {
                    throw {
                        status: "UNAUTHORIZED",
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

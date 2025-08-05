
import { UserRepository } from "@/core/domain/ports/UserRepository";
import { Error as AppError  } from "@/core/domain/models/Error";
import { Response } from "@/core/domain/models/Response";

export class ChangePassword {
    constructor(private userRepository: UserRepository) {}

    async execute(oldPassword: string, confirmPassword: string, newPassword: string): Promise<Response> {
        try {
            if (oldPassword !== confirmPassword) {
                throw ({
                    type: "validation",
                    message: "Las contraseñas no coinciden.",
                });
            }

            const response = await this.userRepository.changePassword(oldPassword, confirmPassword, newPassword);

            return {
                status: response.status,
                path: "/",
                message: "PASSWORD_CHANGED",
            };
            
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
                    message: error.message,
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

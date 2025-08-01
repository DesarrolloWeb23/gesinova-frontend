import { AuthRepository } from "../ports/AuthRepository";
import { TwoFactor } from "@/core/domain/models/TwoFactor"
import { Error } from "@/core/domain/models/Error";
export class ActivateTwoFactor {
    constructor(private authRepository: AuthRepository) {}

    async execute(userId: number, method: number): Promise<TwoFactor> {
        try {
            const response = await this.authRepository.enableMFA(userId, method);

            if (method === 1) {
                return {
                    message: "TOPT_ACTIVATED",
                    data: {
                        qrUri: response.data.qrUri,
                        secretKey: response.data.secretKey,
                        tempToken: response.data.tempToken
                    }
                };
            } else if (method === 2) {
                return {
                    message: "OPT_ACTIVATED",
                    data: {
                        qrUri: response.data.qrUri,
                        secretKey: response.data.secretKey,
                        tempToken: response.data.tempToken
                    }
                };
            }

            return {
                message: "ACTIVATION_FAILED",
                data: {
                    qrUri: "",
                    secretKey: "",
                    tempToken: ""
                }
            };
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
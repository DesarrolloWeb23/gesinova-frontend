import { Error as AppError } from "@/core/domain/models/Error";
import { TransferService } from "@/core/infrastructure/api/services/TransferService";
import { AttentionService } from "../models/AttentionServices";

export class GetAttentionServices {
    constructor(private transferService: TransferService) {}

    async execute(): Promise<AttentionService[]> {
        try {
            const response = await this.transferService.getAttentionServices();
            return response.data.content;
        } catch (err) {
            const error = err as AppError;
            if (error.type === "api") {
                if (error.status === 403) {
                    throw {
                        status: "GROUP_CREATION_FORBIDDEN",
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
                } else if (error.status === 500) {
                    throw {
                        status: "INTERNAL_SERVER_ERROR",
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

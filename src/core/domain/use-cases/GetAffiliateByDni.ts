import { AffiliatesRepository } from '@/core/domain/ports/AffiliatesRepository';
import { Error as AppError } from "@/core/domain/models/Error";
import { Affiliate } from '@/core/domain/models/Affiliate';

export class GetAffiliateByDni {
    constructor(private affiliatesRepository: AffiliatesRepository) {}

    async execute(type: string, dni: string): Promise<Affiliate> {
        try {
            const response = await this.affiliatesRepository.findByDni(type, dni);
            return response.data as Affiliate;
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
import { PermissionsRepository } from "@/core/domain/ports/PermissionsRepository";
import { Error } from "@/core/domain/models/Error";
import { PermissionList  } from "@/core/domain/models/Permission";

export class GetPermissionsInfo {
    constructor(private permissionsRepository: PermissionsRepository) {}

    async execute(): Promise<PermissionList> {
        try {
            const response = await this.permissionsRepository.findAll();
            return response.data as PermissionList;
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
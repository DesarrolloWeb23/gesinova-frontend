import { PermissionsRepository } from "@/core/domain/ports/PermissionsRepository";
import { Response } from "@/core/domain/models/Response";
import { Error } from "@/core/domain/models/Error";

export class AssignPermissionToGroup {
    constructor(private permissionsRepository: PermissionsRepository) {}

    async execute(groupId: number, permissions: string[]): Promise<Response> {
        try {
            // Transformamos permissionCodeName a un array de permisos
            const response = await this.permissionsRepository.assignGroupPermission(groupId, permissions);

            return {
                status: response.status,
                path: "/",
                message: "PERMISSION_ASSIGNED",
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
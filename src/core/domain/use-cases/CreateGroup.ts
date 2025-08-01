import { GroupsRepository } from "@/core/domain/ports/GroupsRepository";
import { Group } from "@/core/domain/models/Group";
import { Error } from "@/core/domain/models/Error";

export class CreateGroup {
    constructor(private groupsRepository: GroupsRepository) {}

    async execute(data: string): Promise<Group> {
        try {
            //convierte el string en un array de strings
            const groupData = data.split(',').map(item => item.trim());
            const response = await this.groupsRepository.createGroup(groupData);
            return response.data as Group;
        } catch (err) {
            const error = err as Error;
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
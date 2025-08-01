import { UserRepository } from "../ports/UserRepository";
import { UserList } from "@/core/domain/models/User";
import { Error } from "@/core/domain/models/Error";

export class GetUserByUserName {
    constructor(private userRepository: UserRepository) {}

    async execute(userName: string): Promise<UserList> {
        try {
            const response = await this.userRepository.getUserByUserName(userName);
            return response.data as UserList;
        } catch (err) {
            const error = err as Error;
            if (error.type === "api") {
                if (error.status === 403) {
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
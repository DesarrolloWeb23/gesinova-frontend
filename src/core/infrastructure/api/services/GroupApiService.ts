import { z, ZodError } from "zod";
import { http } from '../http/http'
import { GroupsDTO } from '@/core/dto/GroupsDTO';
import { AxiosError } from 'axios';
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { ApiErrorDTO } from '@/core/dto/ApiErrorDTO';
import { GroupsRepository } from '@/core/domain/ports/GroupsRepository';
import { GroupDTO } from "@/core/dto/GroupDTO";

const GroupsApiResponseDTO = ApiResponseDTO(GroupsDTO);
type GroupsApiResponse = z.infer<typeof GroupsApiResponseDTO>;

const GroupApiResponseDTO = ApiResponseDTO(GroupDTO);
type GroupApiResponse = z.infer<typeof GroupApiResponseDTO>;

export class GroupApiService implements GroupsRepository {

    async getGroupsInfo(): Promise<GroupsApiResponse> {
        try {
            const response = await http.get('/groups', { withCredentials: true });
            return GroupsApiResponseDTO.parse(response.data);
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                // Error de validación Zod en respuesta de la API
                throw {
                    type: "validation",
                    issues: err.errors,
                };
            }

            // Error devuelto desde el backend (AxiosError)
            if (err instanceof AxiosError && err.response?.data) {
                const parsed = ApiErrorDTO.safeParse(err.response.data);
                if (parsed.success) {
                    throw {
                        type: "api",
                        ...parsed.data,
                    };
                } else {
                    // Respuesta de error de API no coincide con el DTO
                    throw {
                        type: "unknown_api_error",
                        issues: parsed.error.errors,
                    };
                }
            }

            // Error desconocido
            console.error("Error inesperado", err);
            throw {
                type: "unknown",
                issues: err,
            };
        }
    }

    //funcion para traer la informacion de un grupo por id
    async getGroupById(groupId: number): Promise<GroupApiResponse> {
        try {
            const response = await http.get(`/groups/${groupId}`, { withCredentials: true });
            return GroupApiResponseDTO.parse(response.data);
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                throw {
                    type: "validation",
                    issues: err.errors,
                };
            }

            if (err instanceof AxiosError && err.response?.data) {
                const parsed = ApiErrorDTO.safeParse(err.response.data);
                if (parsed.success) {
                    throw {
                        type: "api",
                        ...parsed.data,
                    };
                } else {
                    throw {
                        type: "unknown_api_error",
                        issues: parsed.error.errors,
                    };
                }
            }

            console.error("Error inesperado", err);
            throw {
                type: "unknown",
                issues: err,
            };
        }
    }

    //funcion para crear un grupo
    async createGroup(name: string): Promise<GroupApiResponse> {
        try {
            const response = await http.post('/groups', { name: name }, { withCredentials: true });
            return GroupApiResponseDTO.parse(response.data);
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                throw {
                    type: "validation",
                    issues: err.errors,
                };
            }

            if (err instanceof AxiosError && err.response?.data) {
                const parsed = ApiErrorDTO.safeParse(err.response.data);
                if (parsed.success) {
                    throw {
                        type: "api",
                        ...parsed.data,
                    };
                } else {
                    throw {
                        type: "unknown_api_error",
                        issues: parsed.error.errors,
                    };
                }
            }

            console.error("Error inesperado", err);
            throw {
                type: "unknown",
                issues: err,
            };
        }
    }
}
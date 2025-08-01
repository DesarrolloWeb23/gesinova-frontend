import { http } from '../http/http'
import { PermissionsRepository } from '@/core/domain/ports/PermissionsRepository';
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { AxiosError } from 'axios';
import { ApiErrorDTO } from '@/core/dto/ApiErrorDTO';
import { PermissionsDTO } from '@/core/dto/PermissionsDTO';
import { ResponseDTO } from '@/core/dto/ResponseDTO';
import { z, ZodError } from 'zod';

const UserPermissionsApiResponseDTO = ApiResponseDTO(PermissionsDTO);
type UserPermissionsApiResponse = z.infer<typeof UserPermissionsApiResponseDTO>;


const assignPermissionsApiResponseDTO = ApiResponseDTO(ResponseDTO);
type AssignPermissionsApiResponse = z.infer<typeof assignPermissionsApiResponseDTO>;


export class PermissionApiService implements PermissionsRepository {

    async findAll(): Promise<UserPermissionsApiResponse> {
        try {
            const response = await http.get('/permissions', { withCredentials: true });
            return UserPermissionsApiResponseDTO.parse(response.data);
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

    async assignUserPermission(username: string, permissions: string[]): Promise<AssignPermissionsApiResponse> {
        try {
            const response = await http.post(`/users/assign-permissions`, { username, permissions }, { withCredentials: true });
            return assignPermissionsApiResponseDTO.parse(response.data);
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

    //funcion para asignar permisos a los grupos
    async assignGroupPermission(groupId: number, permissions: string[]): Promise<AssignPermissionsApiResponse> {
        try {
            const response = await http.post(`/groups/assign-permissions`, { groupId, permissions }, { withCredentials: true });
            return assignPermissionsApiResponseDTO.parse(response.data);
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
}
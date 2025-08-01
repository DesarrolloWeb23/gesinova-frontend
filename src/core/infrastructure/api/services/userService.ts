import { http } from '../http/http'
import { AxiosError } from 'axios';
import { ApiErrorDTO } from '@/core/dto/ApiErrorDTO';
import { UserRepository } from '@/core/domain/ports/UserRepository';
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { UserProfileDTO } from '@/core/dto/UserProfileDTO';
import { UsersDataDTO } from '@/core/dto/UsersDataDTO';
import { UserDataDTO } from '@/core/dto/UserDataDTO';
import { z,ZodError } from 'zod';

const UserApiResponseDTO = ApiResponseDTO(UserProfileDTO);
type UserApiResponse = z.infer<typeof UserApiResponseDTO>;

const UserInfoApiResponseDTO = ApiResponseDTO(UsersDataDTO);
type UsersProfileApiResponse = z.infer<typeof UserInfoApiResponseDTO>;

const UserDataApiResponseDTO = ApiResponseDTO(UserDataDTO);
type UserDataApiResponse = z.infer<typeof UserDataApiResponseDTO>;
export class UserApiService implements UserRepository  {

    async getUserProfile(): Promise<UserApiResponse> {
        try {
            const response = await http.get('/users/info', { withCredentials: true });
            return UserApiResponseDTO.parse(response.data);
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

    async getUsersInfo(): Promise<UsersProfileApiResponse> {
        try {
            const response = await http.get('/users?page=1&size=100', { withCredentials: true });
            return UserInfoApiResponseDTO.parse(response.data);
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
            throw {
                type: "unknown",
                issues: err,
            };
        }
    }

    async getUserByUserName(userName: string): Promise<UserDataApiResponse> {
        try {
            const response = await http.get(`/users?username=${userName}`, { withCredentials: true });
            return UserDataApiResponseDTO.parse(response.data);
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
            throw {
                type: "unknown",
                issues: err,
            };
        }
    }

    async getUserById(userId: number): Promise<UserApiResponse> {
        try {
            const response = await http.get(`/users/${userId}`, { withCredentials: true });
            return UserApiResponseDTO.parse(response.data);
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
            throw {
                type: "unknown",
                issues: err,
            };
        }
    }
}
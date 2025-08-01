import { http } from '../http/http'
import { z, ZodError } from 'zod';
import { ApiErrorDTO } from "@/core/dto/ApiErrorDTO";
import { UserDTO } from "@/core/dto/UserDTO";
import { AxiosError } from 'axios';
import { AuthRepository } from "@/core/domain/ports/AuthRepository";
import { BaseResponseDTO } from '@/core/dto/BaseResponseDTO';
import { ResponseDTO } from '@/core/dto/ResponseDTO';
import { AuthEnableMfaDTO } from '@/core/dto/AuthAnableMfaDTO';

const AuthApiResponseDTO = BaseResponseDTO(UserDTO);
type AuthApiResponse = z.infer<typeof AuthApiResponseDTO>;

const LogoutApiResponseDTO = BaseResponseDTO(ResponseDTO);
type LogoutApiResponse = z.infer<typeof LogoutApiResponseDTO>;

const AuthEnableResponseDTO = BaseResponseDTO(AuthEnableMfaDTO);
type AuthEnableResponse = z.infer<typeof AuthEnableResponseDTO>;

// Archivo que hace la llamada a la API y devuelve el resultado
export class AuthApiService implements AuthRepository {
    async login (username: string, password: string): Promise<AuthApiResponse> {
        try {
            const response = await http.post('/auth/login', {
                username: username,
                password: password,
                confirmPassword: password
            }, { withCredentials: true });

            return AuthApiResponseDTO.parse(response.data); 
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

    //funcion secured
    async test() {
        try {
            const response = await http.get('/auth/secured',{withCredentials: true});
            return response.data;
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

    //funcion para habilitar mfa
    async enableMFA(id: number, method: number): Promise<AuthEnableResponse>  {
        try {
            const response = await http.post('/auth/enable-mfa',
                { userId: id, method: method }
            );
            return AuthEnableResponseDTO.parse(response.data);
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

    //funcion para validar mfa
    async validateMFA(tempToken: string, mfaCode: string): Promise<AuthApiResponse> {
        try {
            const response = await http.post('/auth/verify-mfa', { tempToken, mfaCode });
            return AuthApiResponseDTO.parse(response.data);
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

    //funcion para cerrar sesión
    async logout(): Promise<LogoutApiResponse> {
        try {
            const response = await http.post('/auth/logout', {}, { withCredentials: true });
            return LogoutApiResponseDTO.parse(response.data);
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

    //funcion para reestablecer contraseña
    async resetPassword(email: string): Promise<AuthApiResponse> {
        try {
            const response = await http.post('/auth/reset-password', { email });
            return AuthApiResponseDTO.parse(response.data);
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
};

// Puedes agregar más funciones luego: logoutUser, refreshToken, etc.
import { http } from '../http/http'
import { ApiErrorDTO } from "@/core/dto/ApiErrorDTO";
import { AuthResult } from "@/core/dto/AuthResultDTO";
import { AxiosError } from 'axios';
import { AuthRepository } from "@/core/domain/ports/AuthRepository";

// Archivo que hace la llamada a la API y devuelve el resultado
export class AuthApiService implements AuthRepository {
    async login (username: string, password: string): Promise<AuthResult> {
        try {
            const response = await http.post('/auth/login', {
                username: username, 
                password: password, 
                confirmPassword: password},
                {withCredentials: true});
    
            return response.data as AuthResult; 
        } catch (err) {
            const error = err as AxiosError;
            if (error?.response?.data) {
                throw ApiErrorDTO.safeParse(error.response.data);
            }else {
                throw error;
            }
        }
    }

    //funcion secured
    async test() {
        try {
            const response = await http.get('/auth/secured',{withCredentials: true});
            return response.data;
        } catch (err) {
            const error = err as AxiosError;
            if (error?.response?.data) {
                throw ApiErrorDTO.safeParse(error.response.data);
            }else {
                throw error;
            }
        }
    }

    //funcion para habilitar mfa
    async enableMFA(id: number, method: number) {
        try {
            const response = await http.post('/auth/enable-mfa',
                { userId: id, method: method }
            );
            return response.data;
        } catch (err) {
            const error = err as AxiosError;
            if (error?.response?.data) {
                throw ApiErrorDTO.safeParse(error.response.data);
            }else {
                throw error;
            }
        }
    }

    //funcion para validar mfa
    async validateMFA(tempToken: string, mfaCode: string) {
        try {
            const response = await http.post('/auth/verify-mfa', { tempToken, mfaCode });
            return response.data;
        } catch (err) {
            const error = err as AxiosError;
            if (error?.response?.data) {
                throw ApiErrorDTO.safeParse(error.response.data);
            }else {
                throw error;
            }
        }
    }

    //funcion para cerrar sesión
    async logout(): Promise<AuthResult> {
        try {
            const response = await http.post('/auth/logout', {}, { withCredentials: true });
            return response.data;
        } catch (err) {
            const error = err as AxiosError;
            if (error?.response?.data) {
                throw ApiErrorDTO.safeParse(error.response.data);
            } else {
                throw error;
            }
        }
    }

    //funcion para reestablecer contraseña
    async resetPassword(email: string): Promise<AuthResult> {
        try {
            const response = await http.post('/auth/reset-password', { email });
            return response.data;
        } catch (err) {
            const error = err as AxiosError;
            if (error?.response?.data) {
                throw ApiErrorDTO.safeParse(error.response.data);
            } else {
                throw error;
            }
        }
    }
};

// Puedes agregar más funciones luego: logoutUser, refreshToken, etc.
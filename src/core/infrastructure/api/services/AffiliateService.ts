import { http } from '../http/http';
import { AxiosError } from 'axios';
import { z,ZodError } from 'zod';
import { ApiErrorDTO } from '@/core/dto/ApiErrorDTO';
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { AffiliateDTO } from '@/core/dto/AffiliateDTO';
import { AffiliatesRepository } from '@/core/domain/ports/AffiliatesRepository';

const AffiliateApiResponseDTO = ApiResponseDTO(AffiliateDTO);
type AffiliateApiResponse = z.infer<typeof AffiliateApiResponseDTO>;

export class AffiliateApiService implements AffiliatesRepository {

    async findByDni(type: string, dni: string): Promise<AffiliateApiResponse> {
        try {
            const response = await http.get(`/afiliates?identificationNumber=${dni}&identificationType=${type}`, { withCredentials: true }); 
            return AffiliateApiResponseDTO.parse(response.data);
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
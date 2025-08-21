import { http } from '../http/http';
import { AxiosError } from 'axios';
import { z,ZodError } from 'zod';
import { ApiErrorDTO } from '@/core/dto/ApiErrorDTO';
import { TransferRepository } from '@/core/domain/ports/TransferRepository';
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { TurnDTO } from '@/core/dto/TurnDTO';
import { GenerateAppointmentData } from '@/core/domain/models/GenerateAppointmentData';
import { AttentionServicesDTO } from '@/core/dto/AttentionServicesDTO';

const TransferGenerateApiResponseDTO = ApiResponseDTO(TurnDTO);
type TransferGenerateApiResponse = z.infer<typeof TransferGenerateApiResponseDTO>;

const AttentionServiceApiResponseDTO = ApiResponseDTO(AttentionServicesDTO);
type AttentionServiceApiResponse = z.infer<typeof AttentionServiceApiResponseDTO>;

export class TransferService implements TransferRepository {
    
    async generateAppointment(data: GenerateAppointmentData): Promise<TransferGenerateApiResponse> {
        try {
            const response = await http.post(`/turns/generate`, { 
                firstName: data.firstName,
                lastName: data.lastName,
                identificationType: data.identificationType,
                identificationNumber: data.identificationNumber,
                attentionService: data.attentionService,
                classificationAttention: data.classificationAttention
            }, { withCredentials: true });
            return TransferGenerateApiResponseDTO.parse(response.data);
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

    //funcion para obtener los servicios de atencion
    async getAttentionServices(): Promise<AttentionServiceApiResponse> {
        try {
            const response = await http.get(`/attentionServices`, { withCredentials: true });
            return AttentionServiceApiResponseDTO.parse(response.data);
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

    //funcion para avanzar el estado del turno
    async advanceTurnState(turnId: string): Promise<void> {
        try {
            const response = await http.put(`/turns/advance-status/${turnId}`, { withCredentials: true });
            return TransferGenerateApiResponseDTO.parse(response.data);
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

    //funcion para cancelar turno
    async cancelTurn(turnId: string): Promise<void> {
        try {
            const response = await http.delete(`/turns/cancel/${turnId}`, { withCredentials: true });
            return TransferGenerateApiResponseDTO.parse(response.data);
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
import { http } from '../http/http';
import { AxiosError } from 'axios';
import { z,ZodError } from 'zod';
import { ApiErrorDTO } from '@/core/dto/ApiErrorDTO';
import { TransferRepository } from '@/core/domain/ports/TransferRepository';
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { TurnDTO } from '@/core/dto/TurnDTO';
import { GenerateAppointmentData } from '@/core/domain/models/GenerateAppointmentData';
import { AttentionServicesDTO } from '@/core/dto/AttentionServicesDTO';
import { ClassificationAttentionDTO } from '@/core/dto/ClassificationAttention';
import { ResponseDTO } from '@/core/dto/ResponseDTO';
import { TurnDataDTO } from '@/core/dto/TurnDataDTO';
import { AttentionModulesDTO } from '@/core/dto/AttentionModulesDTO';

const AttentionServiceApiResponseDTO = ApiResponseDTO(AttentionServicesDTO);
type AttentionServiceApiResponse = z.infer<typeof AttentionServiceApiResponseDTO>;

const ClassificationAttentionApiResponseDTO = ApiResponseDTO(ClassificationAttentionDTO);
type ClassificationAttentionApiResponse = z.infer<typeof ClassificationAttentionApiResponseDTO>;

const TurnApiResponseDTO = ApiResponseDTO(TurnDTO);
type TurnApiResponse = z.infer<typeof TurnApiResponseDTO>;

const CancelTurnApiResponseDTO = ApiResponseDTO(ResponseDTO);
type CancelTurnApiResponse = z.infer<typeof CancelTurnApiResponseDTO>;

const TurnDataApiResponseDTO = ApiResponseDTO(TurnDataDTO);
type TurnDataApiResponse = z.infer<typeof TurnDataApiResponseDTO>;

const AttentionModulesApiResponseDTO = ApiResponseDTO(AttentionModulesDTO);
type AttentionModulesApiResponse = z.infer<typeof AttentionModulesApiResponseDTO>;

export class TransferService implements TransferRepository {
    
    async generateAppointment(data: GenerateAppointmentData): Promise<TurnApiResponse> {
        try {
            const response = await http.post(`/turns/generate`, { 
                firstName: data.firstName,
                lastName: data.lastName,
                identificationType: data.identificationType,
                identificationNumber: data.identificationNumber,
                attentionService: data.attentionService,
                classificationAttention: data.classificationAttention
            }, { withCredentials: true });
            return TurnApiResponseDTO.parse(response.data);
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

    async getClassificationAttention(): Promise<ClassificationAttentionApiResponse> {
        try {
            const response = await http.get(`/classificationAttention`, { withCredentials: true });
            return ClassificationAttentionApiResponseDTO.parse(response.data);
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

    //funcion para consultar los turnos
    async getTurns(): Promise<TurnDataApiResponse> {
        try {
            const response = await http.get(`/turns`, { withCredentials: true });
            return TurnDataApiResponseDTO.parse(response.data);
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
    async advanceTurnState(turnId: number): Promise<TurnApiResponse> {
        try {
            const response = await http.post(`/turns/advance-status/${turnId}`, { withCredentials: true });
            return TurnApiResponseDTO.parse(response.data);
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
    async cancelTurn(turnId: string): Promise<CancelTurnApiResponse> {
        try {
            const response = await http.post(`/turns/cancel/${turnId}`, { withCredentials: true });
            return CancelTurnApiResponseDTO.parse(response.data);
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

    //funcion para tranferir turno
    async transferTurn(turnId: number, serviceId: string): Promise<TurnApiResponse> {
        try {
            const response = await http.post(`/turns/transfer`, { turnId, serviceId }, { withCredentials: true });
            return TurnApiResponseDTO.parse(response.data);
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

    //funcion para obtener los turnos por estados
    async getTurnsByState(state: number): Promise<TurnDataApiResponse> {
        try {
            const response = await http.get(`/turns?state=${state}`, { withCredentials: true });
            return TurnDataApiResponseDTO.parse(response.data);
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

    //funcion para obtener los modulos de atencion
    async getAttentionModules(): Promise<AttentionModulesApiResponse> {
        try {
            const response = await http.get(`/attention-modules`, { withCredentials: true });
            return AttentionModulesApiResponseDTO.parse(response.data);
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
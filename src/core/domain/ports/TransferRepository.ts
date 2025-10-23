import { z } from "zod";
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { TurnDTO } from "@/core/dto/TurnDTO";
import { GenerateAppointmentData } from "../models/GenerateAppointmentData";
import { AttentionServicesDTO } from "@/core/dto/AttentionServicesDTO";
import { ClassificationAttentionDTO } from "@/core/dto/ClassificationAttention";
import { ResponseDTO } from "@/core/dto/ResponseDTO";
import { TurnDataDTO } from "@/core/dto/TurnDataDTO";
import { AttentionModulesDTO } from "@/core/dto/AttentionModulesDTO";
import { TurnReportDataDTO } from "@/core/dto/ReportTurnDataDTO";

export type TransferGenerateApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof TurnDTO>>>;
export type AttentionServiceApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof AttentionServicesDTO>>>;
export type ClassificationAttentionApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof ClassificationAttentionDTO>>>;
export type TurnApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof TurnDTO>>>;
export type CancelTurnApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof ResponseDTO>>>;
export type TurnDataApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof TurnDataDTO>>>;
export type AttentionModulesApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof AttentionModulesDTO>>>;
export type ReportTurnDataApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof TurnReportDataDTO>>>;

export interface TransferRepository {
    generateAppointment(data: GenerateAppointmentData): Promise<TransferGenerateApiResponse>;
    getAttentionServices(): Promise<AttentionServiceApiResponse>;
    getTurns(): Promise<TurnDataApiResponse>;
    getClassificationAttention(): Promise<ClassificationAttentionApiResponse>;
    advanceTurnState(turnId: number): Promise<TurnApiResponse>;
    cancelTurn(turnId: string, observation: string): Promise<CancelTurnApiResponse>;
    transferTurn(turnId: number, serviceId: string): Promise<TurnApiResponse>;
    getTurnsByState(state: number): Promise<TurnDataApiResponse>;
    getAttentionModules(): Promise<AttentionModulesApiResponse>;
    generateTurnReport(page: string, size: string): Promise<ReportTurnDataApiResponse>;
}
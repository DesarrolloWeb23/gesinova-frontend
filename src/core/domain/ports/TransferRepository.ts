import { z } from "zod";
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { TurnDTO } from "@/core/dto/TurnDTO";
import { GenerateAppointmentData } from "../models/GenerateAppointmentData";
import { AttentionServicesDTO } from "@/core/dto/AttentionServicesDTO";

export type TransferGenerateApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof TurnDTO>>>;
export type AttentionServiceApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof AttentionServicesDTO>>>;

export interface TransferRepository {
    generateAppointment(data: GenerateAppointmentData): Promise<TransferGenerateApiResponse>;
    getAttentionServices(): Promise<AttentionServiceApiResponse>;
}
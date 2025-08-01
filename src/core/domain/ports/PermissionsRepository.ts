import { z } from "zod";
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { PermissionsDTO } from '@/core/dto/PermissionsDTO';
import { ResponseDTO } from '@/core/dto/ResponseDTO';


export type PermissionsApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof PermissionsDTO>>>;
export type AssignUserPermissionsApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof ResponseDTO>>>;

export interface PermissionsRepository {
    findAll(): Promise<PermissionsApiResponse>;
    assignUserPermission(userId: string, permissions: string[]): Promise<AssignUserPermissionsApiResponse>;
    assignGroupPermission(groupId: number, permissions: string[]): Promise<AssignUserPermissionsApiResponse>;
}
import { z } from "zod";
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { GroupsDTO } from '@/core/dto/GroupsDTO';
import { GroupDTO } from "@/core/dto/GroupDTO";

export type GroupsApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof GroupsDTO>>>;
export type GroupApiResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof GroupDTO>>>;

export interface GroupsRepository {
    getGroupsInfo(): Promise<GroupsApiResponse>;
    getGroupById(groupId: number): Promise<GroupApiResponse>;
    createGroup(data: string): Promise<GroupApiResponse>;
}
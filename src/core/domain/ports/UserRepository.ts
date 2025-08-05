import { z } from "zod";
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { UserProfileDTO } from '@/core/dto/UserProfileDTO';
import { UsersDataDTO } from '@/core/dto/UsersDataDTO';
import { UserDataDTO } from '@/core/dto/UserDataDTO';
import { ResponseDTO } from "@/core/dto/ResponseDTO";

export type UserProfileResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof UserProfileDTO>>>;
export type UsersProfilesResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof UsersDataDTO>>>;
export type UserDataResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof UserDataDTO>>>;
export type AssignGroupResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof ResponseDTO>>>;
export type ChangePasswordResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof ResponseDTO>>>;
export interface UserRepository {
    getUserProfile(): Promise<UserProfileResponse>;
    getUserById(userId: number): Promise<UserProfileResponse>;
    getUserByUserName(userName: string): Promise<UserDataResponse>;
    assignUserGroup(userId: string, groupId: string[]): Promise<AssignGroupResponse>;
    changePassword(oldPassword: string, confirmPassword: string, newPassword: string): Promise<ChangePasswordResponse>;
}
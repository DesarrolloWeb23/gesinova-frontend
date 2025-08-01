import { z } from "zod";
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { UserProfileDTO } from '@/core/dto/UserProfileDTO';
import { UsersDataDTO } from '@/core/dto/UsersDataDTO';
import { UserDataDTO } from '@/core/dto/UserDataDTO';

export type UserProfileResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof UserProfileDTO>>>;
export type UsersProfilesResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof UsersDataDTO>>>;
export type UserDataResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof UserDataDTO>>>;
export interface UserRepository {
    getUserProfile(): Promise<UserProfileResponse>;
    getUserById(userId: number): Promise<UserProfileResponse>;
    getUserByUserName(userName: string): Promise<UserDataResponse>;
}
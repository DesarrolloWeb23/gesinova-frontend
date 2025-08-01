import { z } from "zod";
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { UsersDataDTO } from '@/core/dto/UsersDataDTO';

export type UsersProfileResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof UsersDataDTO>>>;

export interface UsersRepository {
    getUsersInfo(): Promise<UsersProfileResponse>;
}
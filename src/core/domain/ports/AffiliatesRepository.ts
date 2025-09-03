import { z } from 'zod';
import { ApiResponseDTO } from '@/core/dto/ApiResponseDTO';
import { AffiliateDTO } from '@/core/dto/AffiliateDTO';


export type AffiliateResponse = z.infer<ReturnType<typeof ApiResponseDTO<typeof AffiliateDTO>>>;

export interface AffiliatesRepository {
    findByDni(type: string, dni: string): Promise<AffiliateResponse>;
}
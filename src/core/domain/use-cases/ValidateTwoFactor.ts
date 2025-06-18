import { AuthRepository } from "@/core/domain/ports/AuthRepository";
import { AuthResult } from "@/core/dto/AuthResultDTO";


export class ValidateTwoFactor {
    
    constructor(private authRepository: AuthRepository) {}

    async execute(tokenTemp: string | null, code: string): Promise<AuthResult> {
        try {
            const response = await this.authRepository.validateMFA(tokenTemp, code);
            return response;
        } catch (error) {
            throw error;
        }
    }
}
import { AuthRepository } from "@/core/domain/ports/AuthRepository";
import { AuthResult } from "@/core/dto/AuthResultDTO";

export class Test {
    constructor(private authRepository: AuthRepository) {}

    async execute(): Promise<AuthResult> {
        try {
            const response = await this.authRepository.test();
            return response;
        } catch (error) {
            throw error;
        }
    }
}
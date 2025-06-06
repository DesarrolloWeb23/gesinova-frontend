import { AuthRepository } from "@/core/domain/ports/AuthRepository";
import { AuthResult } from "@/core/dto/AuthResultDTO";

export class LogoutUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(): Promise<AuthResult> {
        try {
            const response = await this.authRepository.logout();
            if (response) {
                return {
                status: "LOGOUT_SUCCESS",
                path: response.path || "/",
                message: response.message || "Logout successful.",
                data: response.data,
                };
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
}
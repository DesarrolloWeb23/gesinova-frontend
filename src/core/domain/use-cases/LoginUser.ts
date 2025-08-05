import { AuthRepository } from "@/core/domain/ports/AuthRepository";
import { AuthResponse } from "@/core/domain/models/AuthResponse";
import { Error as AppError } from "@/core/domain/models/Error";
export class LoginUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(username: string, password: string): Promise<AuthResponse> {
        try {
                const response = await this.authRepository.login(username, password);

                if (response.data.mfaRequired === false && response.data.mfaVerified === false && response.data.firstLogin === true) {
                    return {
                    status: 200,
                    path: "/activate-mfa",
                    message: "ACTIVATE_MFA",
                    data: response.data,
                    };
                }

                if (response.data.mfaRequired === false && response.data.mfaVerified === false && response.data.firstLogin === false) {
                    return {
                        status: 200,
                        path: "/",
                        message: "MFA_INHABILITATE",
                        data: response.data,
                    };
                }

                if (response.data.mfaRequired === true && response.data.mfaVerified === false && response.data.firstLogin === true) {
                    return {
                        status: 200,
                        path: "/activate-mfa",
                        message: "ACTIVATE_MFA",
                        data: response.data,
                    };
                }

                if (response.data.mfaRequired === true && response.data.mfaVerified === false  && response.data.firstLogin === false) {
                    return {
                        status: 200,
                        path: "/validate-mfa",
                        message: "ACTIVATE_MFA",
                        data: response.data,
                    };
                }

                if (response.data.mfaRequired === true && response.data.mfaVerified === true  && response.data.firstLogin === false) {
                    return {
                        status: 200,
                        path: "/validate-mfa",
                        message: "VALIDATE_MFA",
                        data: response.data,
                    };
                }

                return response;
        } catch (err) {
            const error = err as AppError;
            if (error.type === "api") {
                if(error.status === 403) {
                    throw {
                        status: "ACCESS_DENIED",
                        message: error.message,
                    };
                } else if (error.status === 400) {
                    throw {
                        status: "VALIDATION_ERROR",
                        message: error.message,
                    };
                } else if (error.status === 429) {
                    throw {
                        status: "TOO_MANY_REQUESTS",
                        message: error.message,
                    };
                } else if (error.status === 401) {
                    throw {
                        status: "UNAUTHORIZED",
                        message: error.message,
                    };
                } else if (error.status === 404) {
                    throw {
                        status: "NOT_FOUND",
                        message: error.message,
                    };
                }
            }
            if (error.type === "validation") {
                throw {
                    status: "VALIDATION_ERROR",
                    message: error.message,
                };
            }
            if (error.type === "unknown_api_error") {
                throw {
                    status: "UNKNOWN_API_ERROR",
                    message: error.issues,
                };
            }
            throw {
                status: "UNKNOWN_ERROR",
                message: "Error de red",
            };
        }
    }
}

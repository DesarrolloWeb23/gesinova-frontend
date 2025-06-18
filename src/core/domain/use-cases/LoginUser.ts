import { AuthRepository } from "@/core/domain/ports/AuthRepository";
import { AuthResult } from "@/core/dto/AuthResultDTO";
import { ResponseError } from "@/core/dto/ResponseErrorDTO";
import { getMessage } from "@/core/domain/messages";


export class LoginUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(username: string, password: string): Promise<AuthResult> {
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
                const error = err as ResponseError;
                if (error?.data?.status === 403) {
                    throw {
                        status: "ACCESS_DENIED",
                        message: getMessage("errors", "access_denied")
                    }
                } else {
                    throw {
                        status: "ACCESS_ERROR",
                        message: error?.data?.message || getMessage("errors", "access_error")
                    }
                }
            }
        }
    }

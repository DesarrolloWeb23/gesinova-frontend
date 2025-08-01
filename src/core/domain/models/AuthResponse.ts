export interface AuthResponse { 
    status: number,
    message: string,
    path: string,
    data: {
        user?: {
            id: number,
            username: string,
            name: string,
            lastName: string,
            email: string | null,
            swAdmin: string,
            swActive: string,
            dateJoined: Date | null,
            groups: Array<{
                id: number,
                name: string,
            }>,
            permissions: Array<{
                id: number,
                codename: string,
                name: string,
            }>,
            mfaActive?: boolean | undefined,
            mfaRequired?: boolean | undefined,
        },
        accessToken?: string,
        mfaRequired: boolean,
        mfaVerified: boolean,
        firstLogin: boolean,
        qrUri?: string,
        tempToken?: string,
    }
}
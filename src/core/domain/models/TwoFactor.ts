export interface TwoFactor {
    message: string,
    data: {
        qrUri: string | undefined,
        secretKey: string | undefined,
        tempToken: string | undefined
    },
}
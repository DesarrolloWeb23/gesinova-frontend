export interface TwoFactor {
    message: string,
    data: {
        qrUri: string,
        secretKey: string,
        tempToken: string
    },
}
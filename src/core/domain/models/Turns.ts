export interface Turns {
    id: number,
    turnCode: string,
    identificationType: string,
    identificationNumber: string,
    firstName: string,
    lastName: string,
    state: {
        code: number,
        label: string
    },
    attentionService: {
        id: number,
        internalCode: string,
        name: string,
        swActive: {
            code: number,
            label: string
        },
        module: {
            id: number,
            internalCode: string,
            name: string,
            swActive: {
                code: number,
                label: string
            },
        }
    },
    classificationAttention: {
        id: number,
        internalCode: string,
        description: string,
        attentionType: {
            id: number,
            description: string
        },
    },
    headQuarter: string,
}

export type TurnsList = Turns[];
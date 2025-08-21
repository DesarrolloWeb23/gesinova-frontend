export interface  Turn {
    id: number;
    turnCode: string;
    identificationType: string;
    identificationNumber: string;
    firstName: string;
    lastName: string;
    state: {
        code: number;
        label: string;
    };
}
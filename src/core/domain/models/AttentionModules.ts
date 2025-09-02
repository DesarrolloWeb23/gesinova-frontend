export interface AttentionModule {
    id: number;
    internalCode: string;
    name: string;
    swActive: {
        code: number;
        label: string;
    },
    module: {
        id: number;
        internalCode: string;
        name: string;
        swActive: {
            code: number;
            label: string;
        };
    }
}

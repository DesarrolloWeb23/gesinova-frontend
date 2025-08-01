export interface Group {
    id: number;
    name: string;
    permissions: Array<{
        id: number,
        codename: string,
        name: string,
    }>,
}

export type GroupList = Group[];
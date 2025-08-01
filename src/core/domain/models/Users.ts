export interface Users {
    id: number,
    username: string,
    name: string,
    lastName: string,
    email: string,
    swAdmin: string,
    swActive: string,
    groups: Array<{
        id: number,
        name: string,
    }>,
    permissions: Array<{
        id: number,
        codename: string,
        name: string,
    }>,
    dateJoined: string,
}

export type UsersList = Users[];
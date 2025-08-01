export interface User {
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
}

export type UserList = User[];
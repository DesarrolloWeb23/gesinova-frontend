export class User {
    constructor(
        public id: number,
        public password: string,
        public last_login: string,
        public is_superuser: boolean,
        public username: string,
        public first_name: string,
        public last_name: string,
        public email: string,
        public is_staff: boolean,
        public is_active: boolean
    ) {}
}
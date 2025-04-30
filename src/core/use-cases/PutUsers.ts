import { User } from "../domain/User";
import { IUserRepository } from "@/core/infrastructure/repositories/userRepository";

export class PutUsers {
    constructor(private userRepository: typeof IUserRepository) {}

    async execute(users: User[]): Promise<void> {
        await this.userRepository.putUsers(users);
    }
}
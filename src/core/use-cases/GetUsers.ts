import { User } from "../domain/User";
import { IUserRepository } from "@/infrastructure/repositories/userRepository";

export class GetUsers {
    constructor(private userRepository: typeof IUserRepository) {}

    async execute(): Promise<User[]> {
        return await this.userRepository.getProducts();
    }
}
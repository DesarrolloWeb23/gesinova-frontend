import { User } from '@/core/dto/UserDTO'

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
}
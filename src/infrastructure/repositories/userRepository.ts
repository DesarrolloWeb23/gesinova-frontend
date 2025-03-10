import { http } from '@/infrastructure/api/http'
import { UserDTO } from '@/infrastructure/api/dto/UserDTO'
import { User } from '@/core/domain/User'

export const IUserRepository = {
  getProducts: async () => {
    const response = await http.get<{ results: UserDTO[] }>('https://randomuser.me/api/')

    return response.results.map((userDTO): User => ({
      gender: userDTO.gender,
      phone: userDTO.phone,
      email: userDTO.email,
    }))
  }
}
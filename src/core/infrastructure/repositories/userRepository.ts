import { http } from '@/core/infrastructure/api/http'
import { UserDTO } from '@/core/infrastructure/api/dto/UserDTO'
import { User } from '@/core/domain/User'

export const IUserRepository = {
  getUsers: async () => {
    //const response = await http.get<{ results: UserDTO[] }>('https://randomuser.me/api/')

    const response = {
      results: [
        {
          id: 1,
          password: 'hashed_password',
          last_login: '2024-03-20T10:00:00Z',
          is_superuser: true,
          username: 'admin_user',
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@example.com',
          is_staff: true,
          is_active: true
        },
        {
          id: 2,
          password: 'hashed_password_2',
          last_login: '2024-03-19T15:30:00Z',
          is_superuser: false,
          username: 'john_doe',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          is_staff: false,
          is_active: true
        }
      ]
    }

    return response.results.map((userDTO): User => ({
      id: userDTO.id,
      password: userDTO.password,
      last_login: userDTO.last_login,
      is_superuser: userDTO.is_superuser,
      username: userDTO.username,
      first_name: userDTO.first_name,
      last_name: userDTO.last_name,
      email: userDTO.email,
      is_staff: userDTO.is_staff,
      is_active: userDTO.is_active
    }))
  }
}
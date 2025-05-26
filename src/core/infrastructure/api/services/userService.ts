import { http } from '../http/http'
import { UsersResponse } from '@/core/dto/UserDTO'

export const userService = {
  async getAll() {
    const response = await http.get('/users')
    return UsersResponse.parse(response.data) // Valida con Zod
  }
}
import { http } from './http'
import { UsersResponse } from './dto/UserDTO'

export const userService = {
  async getAll() {
    const response = await http.get('/users')
    return UsersResponse.parse(response.data) // Valida con Zod
  }
}
import { userService } from '@/core/infrastructure/api/userService'

export const getUsers = async () => {
  return await userService.getAll()
}
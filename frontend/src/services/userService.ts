import api from './api'

export interface UserOption {
  id: number
  name: string
  email: string
}

export const userService = {
  async getAll(): Promise<UserOption[]> {
    const { data } = await api.get<UserOption[]>('/users')
    return data
  },
}

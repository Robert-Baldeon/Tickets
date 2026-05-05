import api from './api'

export interface UserProfile {
  id: number
  name: string
  email: string
  role: string
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>('/users/profile')
    return data
  },

  async updateProfile(name: string): Promise<UserProfile> {
    const { data } = await api.put<UserProfile>('/users/profile', { name })
    return data
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/users/profile/password', { currentPassword, newPassword })
  },
}

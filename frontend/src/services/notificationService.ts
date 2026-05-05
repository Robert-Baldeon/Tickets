import api from './api'
import { Notification } from '../types/notification'

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const { data } = await api.get<Notification[]>('/notifications')
    return data
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<number>('/notifications/unread-count')
    return data
  },

  async markAsRead(id: number): Promise<void> {
    await api.put(`/notifications/${id}/read`)
  },
}

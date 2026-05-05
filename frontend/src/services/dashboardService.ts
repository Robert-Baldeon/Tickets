import api from './api'
import { DashboardStats } from '../types/dashboard'

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>('/dashboard/stats')
    return {
      ...data,
      technicianStats: data.technicianStats || [],
    }
  },
}

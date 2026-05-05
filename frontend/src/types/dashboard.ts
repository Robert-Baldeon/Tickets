export interface DashboardStats {
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  closedTickets: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  technicianStats: TechnicianStat[]
}

export interface TechnicianStat {
  userId: number
  userName: string
  userEmail: string
  ticketCount: number
}

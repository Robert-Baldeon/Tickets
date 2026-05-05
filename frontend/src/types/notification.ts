export interface Notification {
  id: number
  message: string
  ticketId: number | null
  ticketTitle: string | null
  read: boolean
  createdAt: string
}

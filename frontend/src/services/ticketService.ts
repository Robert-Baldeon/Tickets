import api from './api'
import { Ticket, TicketFormData, Comment, Attachment } from '../types/ticket'

export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    const { data } = await api.get<Ticket[]>('/tickets')
    return data
  },

  async getById(id: number): Promise<Ticket> {
    const { data } = await api.get<Ticket>(`/tickets/${id}`)
    return data
  },

  async create(ticket: TicketFormData): Promise<Ticket> {
    const { data } = await api.post<Ticket>('/tickets', ticket)
    return data
  },

  async update(id: number, ticket: TicketFormData): Promise<Ticket> {
    const { data } = await api.put<Ticket>(`/tickets/${id}`, ticket)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tickets/${id}`)
  },

  async updateStatus(id: number, status: string): Promise<Ticket> {
    const { data } = await api.put<Ticket>(`/tickets/${id}`, { status })
    return data
  },
}

export const commentService = {
  async getByTicketId(ticketId: number): Promise<Comment[]> {
    const { data } = await api.get<Comment[]>(`/tickets/${ticketId}/comments`)
    return data
  },

  async create(ticketId: number, content: string): Promise<Comment> {
    const { data } = await api.post<Comment>(`/tickets/${ticketId}/comments`, { content })
    return data
  },
}

export const attachmentService = {
  async getByTicketId(ticketId: number): Promise<Attachment[]> {
    const { data } = await api.get<Attachment[]>(`/tickets/${ticketId}/attachments`)
    return data
  },

  async upload(ticketId: number, file: File): Promise<Attachment> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<Attachment>(`/tickets/${ticketId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}

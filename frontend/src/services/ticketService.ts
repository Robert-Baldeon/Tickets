import api from './api'
import { Ticket, TicketFormData, Comment, Attachment } from '../types/ticket'
import { cacheTickets, getCachedTickets, getCachedTicket, addToQueue, updateCachedTicket } from '../utils/offlineStore'

export interface PageResult<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export const ticketService = {
  async getAll(options?: { search?: string; status?: string; priority?: string; page?: number; size?: number }): Promise<PageResult<Ticket>> {
    try {
      const params = new URLSearchParams()
      if (options?.search) params.set('search', options.search)
      if (options?.status) params.set('status', options.status)
      if (options?.priority) params.set('priority', options.priority)
      params.set('page', String(options?.page ?? 0))
      params.set('size', String(options?.size ?? 10))
      const { data } = await api.get<PageResult<Ticket>>(`/tickets?${params}`)
      await cacheTickets(data.content)
      return data
    } catch {
      const cached = await getCachedTickets()
      return {
        content: cached as unknown as unknown as Ticket[],
        totalPages: 1,
        totalElements: cached.length,
        number: 0,
        size: cached.length,
        first: true,
        last: true,
      }
    }
  },

  async getById(id: number): Promise<Ticket> {
    try {
      const { data } = await api.get<Ticket>(`/tickets/${id}`)
      return data
    } catch {
      const cached = await getCachedTicket(id)
      if (cached) return cached as unknown as Ticket
      throw new Error('Ticket not found')
    }
  },

  async create(ticket: TicketFormData): Promise<Ticket | null> {
    const localId = `local_${Date.now()}`
    const tempTicket: Ticket = {
      id: Number(localId.replace('local_', '')),
      title: ticket.title,
      description: ticket.description,
      status: 'ABIERTO',
      priority: ticket.priority || 'MEDIA',
      createdByEmail: null,
      createdByName: null,
      assignedToEmail: ticket.assignedToId ? 'Pendiente de asignacion' : null,
      assignedToId: ticket.assignedToId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      const { data } = await api.post<Ticket>('/tickets', ticket)
      const cached = await getCachedTickets()
      await cacheTickets([...cached, data])
      return data
    } catch {
      await addToQueue({ type: 'create', data: ticket as unknown as Record<string, unknown> })
      const cached = await getCachedTickets()
      await cacheTickets([...cached, tempTicket])
      return tempTicket
    }
  },

  async update(id: number, ticket: TicketFormData): Promise<Ticket> {
    try {
      const { data } = await api.put<Ticket>(`/tickets/${id}`, ticket)
      return data
    } catch {
      await addToQueue({ type: 'status', data: { ticketId: id, status: ticket.status } })
      await updateCachedTicket(id, { status: ticket.status, priority: ticket.priority })
      throw new Error('Guardado local. Se sincronizara al reconectar')
    }
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tickets/${id}`)
  },

  async updateStatus(id: number, status: string): Promise<Ticket> {
    try {
      const { data } = await api.put<Ticket>(`/tickets/${id}`, { status })
      return data
    } catch {
      await addToQueue({ type: 'status', data: { ticketId: id, status } })
      await updateCachedTicket(id, { status })
      const cached = await getCachedTicket(id)
      if (cached) return cached as unknown as Ticket
      throw new Error('Ticket not found')
    }
  },
}

export const commentService = {
  async getByTicketId(ticketId: number): Promise<Comment[]> {
    try {
      const { data } = await api.get<Comment[]>(`/tickets/${ticketId}/comments`)
      return data
    } catch {
      return []
    }
  },

  async create(ticketId: number, content: string): Promise<Comment> {
    try {
      const { data } = await api.post<Comment>(`/tickets/${ticketId}/comments`, { content })
      return data
    } catch {
      await addToQueue({ type: 'comment', data: { ticketId, content } })
      return {
        id: Date.now(),
        content,
        authorName: 'Pendiente de sincronizacion',
        authorEmail: '',
        createdAt: new Date().toISOString(),
      }
    }
  },
}

export const attachmentService = {
  async getByTicketId(ticketId: number): Promise<Attachment[]> {
    try {
      const { data } = await api.get<Attachment[]>(`/tickets/${ticketId}/attachments`)
      return data
    } catch {
      return []
    }
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

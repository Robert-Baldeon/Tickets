export interface Comment {
  id: number
  content: string
  authorName: string
  authorEmail: string
  createdAt: string
}

export interface Attachment {
  id: number
  fileName: string
  contentType: string
  fileSize: number
  uploadedByName: string
  createdAt: string
}

export interface Ticket {
  id: number
  title: string
  description: string
  status: string
  priority: string
  createdByEmail: string | null
  createdByName: string | null
  assignedToEmail: string | null
  createdAt: string
  updatedAt: string
}

export interface TicketFormData {
  title: string
  description: string
  status: string
  priority: string
  assignedToId: number | null
}

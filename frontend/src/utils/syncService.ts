import api from '../services/api'
import {
  getQueuedOperations,
  clearQueue,
  removeQueuedOperation,
  cacheTickets,
  getCachedTickets,
  QueuedOperation,
} from '../utils/offlineStore'

async function processQueue(): Promise<void> {
  const queue = await getQueuedOperations()
  if (queue.length === 0) return

  const pending = queue.filter((op) => op.status === 'pending')
  for (const op of pending) {
    try {
      await executeOperation(op)
      await removeQueuedOperation(op.localId)
    } catch {
      console.warn('Failed to sync operation', op.localId)
    }
  }
}

async function executeOperation(op: QueuedOperation): Promise<void> {
  switch (op.type) {
    case 'create': {
      const { data } = await api.post('/tickets', op.data)
      if (data) {
        const cached = await getCachedTickets()
        await cacheTickets([...cached, data])
      }
      break
    }
    case 'comment': {
      const { ticketId, content } = op.data as { ticketId: number; content: string }
      await api.post(`/tickets/${ticketId}/comments`, { content })
      break
    }
    case 'status': {
      const { ticketId, status } = op.data as { ticketId: number; status: string }
      await api.put(`/tickets/${ticketId}`, { status })
      break
    }
  }
}

export async function syncPendingOperations(): Promise<boolean> {
  const queue = await getQueuedOperations()
  if (queue.length === 0) return false

  await processQueue()
  return true
}

export { getQueuedOperations, getCachedTickets, cacheTickets } from '../utils/offlineStore'

const DB_NAME = 'tickets-offline-db'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('tickets')) {
        db.createObjectStore('tickets', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('queue')) {
        const queueStore = db.createObjectStore('queue', { keyPath: 'localId' })
        queueStore.createIndex('status', 'status')
      }
    }

    request.onsuccess = () => resolve(request.result)
  })
}

export interface QueuedOperation {
  localId: string
  type: 'create' | 'comment' | 'status'
  data: Record<string, unknown>
  timestamp: number
  status: 'pending' | 'syncing'
}

export async function cacheTicket(ticket: Record<string, any>): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tickets', 'readwrite')
    tx.objectStore('tickets').put(ticket)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function cacheTickets(tickets: Record<string, any>[]): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tickets', 'readwrite')
    const store = tx.objectStore('tickets')
    store.clear()
    tickets.forEach((ticket) => store.put(ticket))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getCachedTickets(): Promise<Record<string, any>[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tickets', 'readonly')
    const request = tx.objectStore('tickets').getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getCachedTicket(id: number): Promise<Record<string, any> | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tickets', 'readonly')
    const request = tx.objectStore('tickets').get(id)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export async function updateCachedTicket(id: number, updates: Record<string, any>): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tickets', 'readwrite')
    const store = tx.objectStore('tickets')
    const request = store.get(id)
    request.onsuccess = () => {
      const existing = request.result
      if (existing) {
        store.put({ ...existing, ...updates, id })
      }
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function addToQueue(operation: Omit<QueuedOperation, 'localId' | 'timestamp' | 'status'>): Promise<string> {
  const db = await openDB()
  const localId = `op_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const entry: QueuedOperation = {
    localId,
    ...operation,
    timestamp: Date.now(),
    status: 'pending',
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readwrite')
    tx.objectStore('queue').put(entry)
    tx.oncomplete = () => resolve(localId)
    tx.onerror = () => reject(tx.error)
  })
}

export async function getQueuedOperations(): Promise<QueuedOperation[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readonly')
    const request = tx.objectStore('queue').getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function clearQueue(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readwrite')
    tx.objectStore('queue').clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function removeQueuedOperation(localId: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readwrite')
    tx.objectStore('queue').delete(localId)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function clearAllCache(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['tickets', 'queue'], 'readwrite')
    tx.objectStore('tickets').clear()
    tx.objectStore('queue').clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

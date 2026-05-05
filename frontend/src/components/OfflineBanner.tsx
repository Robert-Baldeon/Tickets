import { useState, useEffect } from 'react'
import { useNetworkStatus } from '../hooks/useNetworkStatus'
import { syncPendingOperations } from '../utils/syncService'

export default function OfflineBanner() {
  const isOnline = useNetworkStatus()
  const [syncing, setSyncing] = useState(false)
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    if (isOnline && !syncing && !synced) {
      setSyncing(true)
      syncPendingOperations().then((hadPending) => {
        if (hadPending) {
          setSynced(true)
          setTimeout(() => setSynced(false), 3000)
          window.dispatchEvent(new CustomEvent('offline-sync'))
        }
        setSyncing(false)
      })
    }
  }, [isOnline])

  if (isOnline && !syncing && !synced) return null

  return (
    <div
      style={{
        backgroundColor: isOnline ? '#27ae60' : '#c0392b',
        color: '#ffffff',
        textAlign: 'center',
        padding: '8px 16px',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 1.5,
      }}
    >
      {!isOnline && 'TRABAJANDO SIN CONEXION'}
      {syncing && 'SINCRONIZANDO...'}
      {synced && 'SINCRONIZACION COMPLETADA'}
    </div>
  )
}

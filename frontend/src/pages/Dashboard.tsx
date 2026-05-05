import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardService } from '../services/dashboardService'
import { DashboardStats } from '../types/dashboard'
import NotificationBell from '../components/NotificationBell'
import ThemeToggle from '../components/ThemeToggle'
import ErrorBoundary from '../components/ErrorBoundary'

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout, name } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.getStats()
      .then((data) => {
        setStats(data)
        setError(null)
      })
      .catch((e) => {
        console.error('Dashboard getStats error:', e)
        setError(e.response?.data?.message || e.message || 'Error al cargar estadisticas')
      })
      .finally(() => setLoading(false))
    const handleSync = () => dashboardService.getStats().then(setStats).catch(console.error)
    window.addEventListener('offline-sync', handleSync)
    return () => window.removeEventListener('offline-sync', handleSync)
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      <header
        style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0 32px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1
          style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-primary)', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          GESTION DE TICKETS
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <nav style={{ display: 'flex', gap: 24 }}>
            <span
              style={{ fontSize: 13, color: 'var(--header-active-nav)', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => navigate('/dashboard')}
            >
              DASHBOARD
            </span>
            <span
              style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}
              onClick={() => navigate('/tickets')}
            >
              TICKETS
            </span>
          </nav>
          <NotificationBell />
          <ThemeToggle />
          <span
            style={{ fontSize: 13, color: 'var(--text-tertiary)', cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          >{name}</span>
          <div
            style={{
              width: 36,
              height: 36,
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={logout}
            title="Cerrar sesion"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--icon-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
        </div>
      </header>

      <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 32 }}>
          RESUMEN GENERAL
        </h2>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
            Cargando estadisticas...
          </div>
        ) : error ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ color: 'var(--error-color)', fontSize: 14, marginBottom: 12 }}>{error}</div>
            <button
              onClick={() => {
                setLoading(true)
                setError(null)
                dashboardService.getStats()
                  .then(setStats)
                  .catch((e) => setError(e.response?.data?.message || 'Error al cargar estadisticas'))
                  .finally(() => setLoading(false))
              }}
              style={{
                padding: '8px 24px',
                backgroundColor: 'var(--btn-primary)',
                color: 'var(--text-on-primary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              REINTENTAR
            </button>
          </div>
        ) : stats ? (
          <>
            <div style={{ marginBottom: 32 }}>
              <StatCard
                label="TOTAL TICKETS"
                value={stats.totalTickets}
                color="var(--text-primary)"
                bg="var(--bg-badge-soft)"
              />
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-secondary)', marginBottom: 16 }}>
              POR ESTADO
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
              <StatCard
                label="ABIERTOS"
                value={stats.openTickets}
                color="var(--text-primary)"
                bg="var(--bg-badge-soft)"
              />
              <StatCard
                label="EN PROCESO"
                value={stats.inProgressTickets}
                color="var(--badge-en-progreso-text)"
                bg="var(--bg-badge-en-proceso)"
              />
              <StatCard
                label="CERRADOS"
                value={stats.closedTickets}
                color="var(--badge-cerrado-text)"
                bg="var(--bg-page)"
              />
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-secondary)', marginBottom: 16 }}>
              POR PRIORIDAD
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
              <StatCard
                label="ALTA"
                value={stats.highPriority}
                color="var(--badge-alta-text)"
                bg="var(--bg-badge-alta)"
              />
              <StatCard
                label="MEDIA"
                value={stats.mediumPriority}
                color="var(--badge-media-text)"
                bg="var(--bg-badge-en-proceso)"
              />
              <StatCard
                label="BAJA"
                value={stats.lowPriority}
                color="var(--badge-baja-text)"
                bg="var(--bg-badge-baja)"
              />
            </div>

            {stats.technicianStats?.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  TICKETS POR TECNICO
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--btn-primary)' }}>
                        <th style={thStyle}>TECNICO</th>
                        <th style={thStyle}>EMAIL</th>
                        <th style={{ ...thStyle, width: 120, textAlign: 'right' }}>TICKETS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.technicianStats.map((tech) => (
                        <tr key={tech.userId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={tdStyle}>{tech.userName}</td>
                          <td style={tdStyle}>{tech.userEmail}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 16px',
                                fontSize: 14,
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                backgroundColor: 'var(--bg-badge-soft)',
                              }}
                            >
                              {tech.ticketCount}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

function StatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        padding: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 28,
          fontWeight: 700,
          color,
          backgroundColor: bg,
          padding: '8px 16px',
        }}
      >
        {value}
      </span>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '14px 20px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1.5,
  color: 'var(--text-on-primary)',
}

const tdStyle: React.CSSProperties = {
  padding: '14px 20px',
  fontSize: 13,
  color: 'var(--text-primary)',
}

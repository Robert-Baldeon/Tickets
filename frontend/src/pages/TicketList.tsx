import { useState, useEffect, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ticketService, PageResult } from '../services/ticketService'
import { Ticket } from '../types/ticket'
import NotificationBell from '../components/NotificationBell'
import ThemeToggle from '../components/ThemeToggle'

export default function TicketList() {
  const navigate = useNavigate()
  const { logout, name, isAdmin } = useAuth()

  const [pageResult, setPageResult] = useState<PageResult<Ticket> | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [priorityFilter, setPriorityFilter] = useState('Todas')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const pageSize = 10

  useEffect(() => {
    loadTickets()
    const handleSync = () => loadTickets()
    window.addEventListener('offline-sync', handleSync)
    return () => window.removeEventListener('offline-sync', handleSync)
  }, [search, statusFilter, priorityFilter, page])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const data = await ticketService.getAll()
      setPageResult(data)
    } catch {
      console.error('Error loading tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Eliminar este ticket?')) return
    try {
      await ticketService.delete(id)
      loadTickets()
    } catch {
      console.error('Error deleting ticket')
    }
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(0)
  }

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
    setPage(0)
  }

  const handlePriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value)
    setPage(0)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (loading && !pageResult) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        <Header navigate={navigate} logout={logout} name={name} />
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          Cargando tickets...
        </div>
      </div>
    )
  }

  const tickets = pageResult?.content || []
  const totalPages = pageResult?.totalPages || 0
  const totalElements = pageResult?.totalElements || 0

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      <Header navigate={navigate} logout={logout} name={name} />

      <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: 24,
            marginBottom: 24,
            display: 'flex',
            gap: 24,
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>BUSCAR POR ID O TITULO</label>
            <div style={{ position: 'relative' }}>
              <svg
                style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-secondary)' }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Buscar tickets..."
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ width: 180 }}>
            <label style={labelStyle}>ESTADO</label>
            <select value={statusFilter} onChange={handleStatusChange} style={inputStyle}>
              <option value="Todos">Todos</option>
              <option value="ABIERTO">ABIERTO</option>
              <option value="EN_PROGRESO">EN PROCESO</option>
              <option value="CERRADO">CERRADO</option>
            </select>
          </div>

          <div style={{ width: 180 }}>
            <label style={labelStyle}>PRIORIDAD</label>
            <select value={priorityFilter} onChange={handlePriorityChange} style={inputStyle}>
              <option value="Todas">Todas</option>
              <option value="ALTA">ALTA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="BAJA">BAJA</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button
            onClick={() => navigate('/tickets/new')}
            style={primaryBtnStyle}
          >
            + CREAR TICKET
          </button>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {totalElements} ticket{totalElements !== 1 ? 's' : ''} encontrado{totalElements !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          {tickets.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
              No se encontraron tickets
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--btn-primary)' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>TITULO</th>
                  <th style={thStyle}>ESTADO</th>
                  <th style={thStyle}>PRIORIDAD</th>
                  <th style={thStyle}>FECHA</th>
                  <th style={thStyle}>USUARIO</th>
                  <th style={thStyle}>TECNICO</th>
                  {isAdmin && (
                    <th style={{ ...thStyle, width: 80 }}>ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr
                    key={t.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                    onClick={() => navigate(`/tickets/${t.id}`)}
                  >
                    <td style={tdStyle}>{t.id}</td>
                    <td style={tdStyle}>{t.title}</td>
                    <td style={tdStyle}>
                      <span style={badgeStyle(statusColor(t.status))}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={badgeStyle(priorityColor(t.priority))}>
                        {t.priority}
                      </span>
                    </td>
                    <td style={tdStyle}>{formatDate(t.createdAt)}</td>
                    <td style={tdStyle}>{t.createdByEmail || '-'}</td>
                    <td style={tdStyle}>{t.assignedToEmail || '-'}</td>
                    {isAdmin && (
                      <td style={tdStyle}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/tickets/edit/${t.id}`)
                          }}
                          style={actionBtnStyle}
                        >
                          Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(t.id)
                          }}
                          style={{ ...actionBtnStyle, color: 'var(--btn-danger)' }}
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              style={pageBtnStyle(page === 0)}
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                style={pageBtnStyle(false, p === page)}
              >
                {p + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
              style={pageBtnStyle(page >= totalPages - 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Header({ navigate, logout, name }: { navigate: (path: string) => void; logout: () => void; name: string | null }) {
  return (
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
        style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 1.5,
          color: 'var(--text-primary)',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/dashboard')}
      >
        GESTION DE TICKETS
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <nav style={{ display: 'flex', gap: 24 }}>
          <span
            style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            DASHBOARD
          </span>
          <span
            style={{ fontSize: 13, color: 'var(--header-active-nav)', fontWeight: 700, cursor: 'pointer' }}
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
  )
}

function badgeStyle(color: string): React.CSSProperties {
  return {
    display: 'inline-block',
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
    border: `1px solid ${color}`,
    color,
  }
}

function statusColor(status: string): string {
  switch (status) {
    case 'ABIERTO': return 'var(--badge-abierto-text)'
    case 'EN_PROGRESO': return 'var(--badge-en-progreso-text)'
    case 'CERRADO': return 'var(--badge-cerrado-text)'
    default: return 'var(--badge-abierto-text)'
  }
}

function priorityColor(priority: string): string {
  switch (priority) {
    case 'ALTA': return 'var(--badge-alta-text)'
    case 'MEDIA': return 'var(--badge-media-text)'
    case 'BAJA': return 'var(--badge-baja-text)'
    default: return 'var(--text-secondary)'
  }
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 1,
  color: 'var(--text-secondary)',
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  fontSize: 14,
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
  outline: 'none',
}

const primaryBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 1.5,
  color: 'var(--text-on-primary)',
  backgroundColor: 'var(--btn-primary)',
  border: 'none',
  cursor: 'pointer',
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

const actionBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 12,
  color: 'var(--text-primary)',
  cursor: 'pointer',
  padding: '4px 8px',
  fontWeight: 600,
}

function pageBtnStyle(disabled: boolean, active: boolean = false): React.CSSProperties {
  return {
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: active ? 700 : 600,
    color: active ? 'var(--text-on-primary)' : disabled ? 'var(--text-secondary)' : 'var(--text-primary)',
    backgroundColor: active ? 'var(--btn-primary)' : 'var(--bg-card)',
    border: '1px solid',
    borderColor: active ? 'var(--btn-primary)' : disabled ? 'var(--border-color)' : 'var(--border-color)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }
}

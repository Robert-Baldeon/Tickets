import { useState, useEffect, useMemo, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ticketService } from '../services/ticketService'
import { Ticket } from '../types/ticket'

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const { logout, name } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const data = await ticketService.getAll()
      setTickets(data)
    } catch {
      console.error('Error loading tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este ticket?')) return
    try {
      await ticketService.delete(id)
      setTickets((prev) => prev.filter((t) => t.id !== id))
    } catch {
      console.error('Error deleting ticket')
    }
  }

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        search === '' ||
        t.id.toString().includes(search) ||
        t.title.toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        statusFilter === 'Todos' || t.status === statusFilter.toUpperCase()
      return matchSearch && matchStatus
    })
  }, [tickets, search, statusFilter])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
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
            color: '#1a1f2e',
          }}
        >
          GESTION DE TICKETS
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#666' }}>{name}</span>
          <div
            style={{
              width: 36,
              height: 36,
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={logout}
            title="Cerrar sesión"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1f2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
        </div>
      </header>

      <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Filters */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            padding: 24,
            marginBottom: 24,
            display: 'flex',
            gap: 24,
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 1,
                color: '#888',
                marginBottom: 8,
              }}
            >
              BUSCAR POR ID O TITULO
            </label>
            <div style={{ position: 'relative' }}>
              <svg
                style={{ position: 'absolute', left: 12, top: 14, color: '#aaa' }}
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar tickets..."
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  fontSize: 14,
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#ffffff',
                  color: '#1a1f2e',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ width: 200 }}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 1,
                color: '#888',
                marginBottom: 8,
              }}
            >
              ESTADO
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: 14,
                border: '1px solid #e0e0e0',
                backgroundColor: '#ffffff',
                color: '#1a1f2e',
                outline: 'none',
              }}
            >
              <option value="Todos">Todos</option>
              <option value="ABIERTO">ABIERTO</option>
              <option value="EN_PROGRESO">EN PROCESO</option>
              <option value="CERRADO">CERRADO</option>
            </select>
          </div>
        </div>

        {/* Create button */}
        <button
          onClick={() => navigate('/tickets/new')}
          style={{
            padding: '12px 24px',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: '#ffffff',
            backgroundColor: '#1a1f2e',
            border: 'none',
            cursor: 'pointer',
            marginBottom: 24,
          }}
        >
          + CREAR TICKET
        </button>

        {/* Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#888', fontSize: 14 }}>
              Cargando tickets...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#888', fontSize: 14 }}>
              No se encontraron tickets
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1f2e' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>TITULO</th>
                  <th style={thStyle}>ESTADO</th>
                  <th style={thStyle}>FECHA</th>
                  <th style={thStyle}>USUARIO</th>
                  <th style={{ ...thStyle, width: 80 }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    style={{ borderBottom: '1px solid #e8e8e8', cursor: 'pointer' }}
                    onClick={() => navigate(`/tickets/${t.id}`)}
                  >
                    <td style={tdStyle}>{t.id}</td>
                    <td style={tdStyle}>{t.title}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          border: `1px solid ${statusColor(t.status)}`,
                          color: statusColor(t.status),
                        }}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={tdStyle}>{formatDate(t.createdAt)}</td>
                    <td style={tdStyle}>{t.createdByEmail || '-'}</td>
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
                        style={{ ...actionBtnStyle, color: '#d32f2f' }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '14px 20px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1.5,
  color: '#ffffff',
}

const tdStyle: React.CSSProperties = {
  padding: '14px 20px',
  fontSize: 13,
  color: '#1a1f2e',
}

const actionBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 12,
  color: '#1a1f2e',
  cursor: 'pointer',
  padding: '4px 8px',
  fontWeight: 600,
}

function statusColor(status: string): string {
  switch (status) {
    case 'ABIERTO':
      return '#1a1f2e'
    case 'EN_PROGRESO':
      return '#e67e22'
    case 'CERRADO':
      return '#888'
    default:
      return '#1a1f2e'
  }
}

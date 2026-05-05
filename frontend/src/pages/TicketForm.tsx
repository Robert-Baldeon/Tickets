import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ticketService } from '../services/ticketService'
import { userService } from '../services/userService'
import { TicketFormData } from '../types/ticket'
import NotificationBell from '../components/NotificationBell'
import ThemeToggle from '../components/ThemeToggle'

export default function TicketForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const { logout, name, isAdmin } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('ABIERTO')
  const [priority, setPriority] = useState('MEDIA')
  const [assignedToId, setAssignedToId] = useState<number | null>(null)
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string }>>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    const init = async () => {
      if (isAdmin) {
        try {
          const usersData = await userService.getAll()
          setUsers(usersData)
        } catch {
          console.error('Error loading users')
        }
      }

      if (isEdit) {
        try {
          const ticket = await ticketService.getById(Number(id))
          setTitle(ticket.title)
          setDescription(ticket.description)
          setStatus(ticket.status)
          setPriority(ticket.priority)
          setAssignedToId(ticket.assignedToId)
        } catch {
          console.error('Error loading ticket')
        } finally {
          setLoading(false)
        }
      }
    }
    init()
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const data: TicketFormData = {
      title,
      description,
      status,
      priority,
      assignedToId,
    }

    try {
      if (isEdit) {
        await ticketService.update(Number(id), data)
      } else {
        await ticketService.create(data)
      }
      navigate('/tickets')
    } catch {
      console.error('Error saving ticket')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        <Header onLogout={logout} userName={name} />
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          Cargando ticket...
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      <Header onLogout={logout} userName={name} />

      <div style={{ padding: '32px 40px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => navigate('/tickets')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: 13,
              cursor: 'pointer',
              padding: '8px 0',
            }}
          >
            Volver al listado
          </button>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginTop: 8,
            }}
          >
            {isEdit ? 'EDITAR TICKET' : 'CREAR TICKET'}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: 32,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>TITULO</label>
            <input
              type="text"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>DESCRIPCION</label>
            <textarea
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>ESTADO</label>
              <select
                value={status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
                style={inputStyle}
              >
                <option value="ABIERTO">ABIERTO</option>
                <option value="EN_PROGRESO">EN PROCESO</option>
                <option value="CERRADO">CERRADO</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>PRIORIDAD</label>
              <select
                value={priority}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value)}
                style={inputStyle}
              >
                <option value="BAJA">BAJA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
              </select>
            </div>
          </div>

          {isAdmin && (
            <div style={{ marginBottom: 32 }}>
              <label style={labelStyle}>TECNICO ASIGNADO</label>
              <select
                value={assignedToId ?? ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setAssignedToId(e.target.value ? Number(e.target.value) : null)
                }
                style={inputStyle}
              >
                <option value="">Sin asignar</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '14px 32px',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: 'var(--text-on-primary)',
                backgroundColor: 'var(--btn-primary)',
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'GUARDANDO...' : isEdit ? 'GUARDAR CAMBIOS' : 'CREAR TICKET'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              style={{
                padding: '14px 32px',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
              }}
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Header({ onLogout, userName }: { onLogout: () => void; userName: string | null }) {
  const navigate = useNavigate()
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
        style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-primary)', cursor: 'pointer' }}
        onClick={() => navigate('/tickets')}
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
        >{userName}</span>
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
          onClick={onLogout}
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

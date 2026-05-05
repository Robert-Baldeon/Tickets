import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ticketService } from '../services/ticketService'
import { TicketFormData } from '../types/ticket'

export default function TicketForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const { logout, name } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('ABIERTO')
  const [priority, setPriority] = useState('MEDIA')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) loadTicket()
  }, [id])

  const loadTicket = async () => {
    try {
      const ticket = await ticketService.getById(Number(id))
      setTitle(ticket.title)
      setDescription(ticket.description)
      setStatus(ticket.status)
      setPriority(ticket.priority)
    } catch {
      console.error('Error loading ticket')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const data: TicketFormData = {
      title,
      description,
      status,
      priority,
      assignedToId: null,
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Header onLogout={logout} userName={name} />
        <div style={{ padding: 48, textAlign: 'center', color: '#888', fontSize: 14 }}>
          Cargando ticket...
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header onLogout={logout} userName={name} />

      <div style={{ padding: '32px 40px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => navigate('/tickets')}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
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
              color: '#1a1f2e',
              marginTop: 8,
            }}
          >
            {isEdit ? 'EDITAR TICKET' : 'CREAR TICKET'}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            padding: 32,
          }}
        >
          {/* Title */}
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

          {/* Description */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>DESCRIPCION</label>
            <textarea
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Status and Priority row */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
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

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '14px 32px',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: '#ffffff',
                backgroundColor: '#1a1f2e',
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
                color: '#888',
                backgroundColor: 'transparent',
                border: '1px solid #e0e0e0',
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
        style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1.5, color: '#1a1f2e', cursor: 'pointer' }}
        onClick={() => navigate('/tickets')}
      >
        GESTION DE TICKETS
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 13, color: '#666' }}>{userName}</span>
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
          onClick={onLogout}
          title="Cerrar sesion"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1f2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  color: '#888',
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  fontSize: 14,
  border: '1px solid #e0e0e0',
  backgroundColor: '#ffffff',
  color: '#1a1f2e',
  outline: 'none',
}

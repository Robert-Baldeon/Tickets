import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ticketService, commentService, attachmentService } from '../services/ticketService'
import { Ticket, Comment, Attachment } from '../types/ticket'
import NotificationBell from '../components/NotificationBell'
import ThemeToggle from '../components/ThemeToggle'

const STATUS_ORDER = ['ABIERTO', 'EN_PROGRESO', 'CERRADO']

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { logout, name } = useAuth()

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingComment, setSavingComment] = useState(false)

  useEffect(() => {
    if (id) loadData(Number(id))
  }, [id])

  const loadData = async (ticketId: number) => {
    try {
      const [ticketData, commentsData, attachmentsData] = await Promise.all([
        ticketService.getById(ticketId),
        commentService.getByTicketId(ticketId),
        attachmentService.getByTicketId(ticketId),
      ])
      setTicket(ticketData)
      setComments(commentsData)
      setAttachments(attachmentsData)
    } catch {
      console.error('Error loading ticket data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !id) return

    setSavingComment(true)
    try {
      const newComment = await commentService.create(Number(id), commentText)
      setComments((prev) => [...prev, newComment])
      setCommentText('')
    } catch {
      console.error('Error adding comment')
    } finally {
      setSavingComment(false)
    }
  }

  const handleStatusChange = async () => {
    if (!ticket || !id) return
    const currentIndex = STATUS_ORDER.indexOf(ticket.status)
    const nextStatus = STATUS_ORDER[(currentIndex + 1) % STATUS_ORDER.length]

    try {
      const updated = await ticketService.updateStatus(Number(id), nextStatus)
      setTicket(updated)
    } catch {
      console.error('Error changing status')
    }
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return

    try {
      const uploaded = await attachmentService.upload(Number(id), file)
      setAttachments((prev) => [...prev, uploaded])
    } catch {
      console.error('Error uploading file')
    }

    e.target.value = ''
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case 'ABIERTO': return 'var(--badge-abierto-text)'
      case 'EN_PROGRESO': return 'var(--badge-en-progreso-text)'
      case 'CERRADO': return 'var(--badge-cerrado-text)'
      default: return 'var(--badge-abierto-text)'
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

  if (!ticket) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        <Header onLogout={logout} userName={name} />
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          Ticket no encontrado
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      <Header onLogout={logout} userName={name} />

      <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => navigate('/tickets')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: 13,
              cursor: 'pointer',
              padding: '4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>&larr;</span>
            Volver al listado
          </button>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            {ticket.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Ticket #{ticket.id}</span>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 0.5,
                border: `1px solid ${statusBadgeColor(ticket.status)}`,
                color: statusBadgeColor(ticket.status),
              }}
            >
              {ticket.status.replace('_', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 48, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 4 }}>
                FECHA DE CREACION
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{formatDate(ticket.createdAt)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 4 }}>
                CREADO POR
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{ticket.createdByName || ticket.createdByEmail || '-'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 4 }}>
                TECNICO ASIGNADO
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                {ticket.assignedToEmail || 'Sin asignar'}
              </div>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', marginBottom: 24 }} />

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 8 }}>
              DESCRIPCION
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {ticket.description || 'Sin descripcion'}
            </p>
          </div>

          <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', marginBottom: 24 }} />

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 16 }}>
              COMENTARIOS ({comments.length})
            </div>

            {comments.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {comments.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      border: '1px solid var(--border-color)',
                      padding: 16,
                      backgroundColor: 'var(--bg-card)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.authorName}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {formatDateTime(c.createdAt)}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {comments.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 24, fontStyle: 'italic' }}>
                No hay comentarios todavia
              </p>
            )}
          </div>

          <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', marginBottom: 24 }} />

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 8 }}>
              ANADIR COMENTARIO
            </div>
            <form onSubmit={handleAddComment}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe tu comentario aqui..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 14,
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  marginBottom: 12,
                }}
              />
              <button
                type="submit"
                disabled={savingComment || !commentText.trim()}
                style={{
                  padding: '10px 20px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  cursor: savingComment || !commentText.trim() ? 'not-allowed' : 'pointer',
                  opacity: savingComment || !commentText.trim() ? 0.5 : 1,
                }}
              >
                {savingComment ? 'AÑADIENDO...' : 'ANADIR COMENTARIO'}
              </button>
            </form>
          </div>

          <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', marginBottom: 24 }} />

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 16 }}>
              ARCHIVOS ADJUNTOS ({attachments.length})
            </div>

            {attachments.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {attachments.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      border: '1px solid var(--border-color)',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{a.fileName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {formatFileSize(a.fileSize)} &middot; {formatDateTime(a.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', marginBottom: 24 }} />

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleStatusChange}
              style={{
                padding: '14px 28px',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                color: 'var(--text-on-primary)',
                backgroundColor: 'var(--btn-primary)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              CAMBIAR ESTADO
            </button>

            <label
              style={{
                padding: '14px 28px',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              ADJUNTAR ARCHIVO
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
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

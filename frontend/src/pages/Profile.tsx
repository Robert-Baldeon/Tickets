import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/profileService'
import { UserProfile } from '../services/profileService'
import NotificationBell from '../components/NotificationBell'
import ThemeToggle from '../components/ThemeToggle'

export default function Profile() {
  const navigate = useNavigate()
  const { logout, name, updateName } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const [editName, setEditName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile()
      setProfile(data)
      setEditName(data.name)
    } catch {
      console.error('Error loading profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateName = async (e: FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) return

    setSavingName(true)
    setNameSuccess(false)
    try {
      const updated = await profileService.updateProfile(editName)
      setProfile(updated)
      updateName(updated.name)
      setNameSuccess(true)
    } catch {
      console.error('Error updating name')
    } finally {
      setSavingName(false)
    }
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contrasenas no coinciden')
      return
    }

    if (newPassword.length < 4) {
      setPasswordError('La nueva contrasena debe tener al menos 4 caracteres')
      return
    }

    setSavingPassword(true)
    try {
      await profileService.changePassword(currentPassword, newPassword)
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setPasswordError('La contrasena actual es incorrecta')
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        <Header navigate={navigate} logout={logout} userName={name} />
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          Cargando perfil...
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        <Header navigate={navigate} logout={logout} userName={name} />
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          Error cargando perfil
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      <Header navigate={navigate} logout={logout} userName={name} />

      <div style={{ padding: '32px 40px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: 13,
              cursor: 'pointer',
              padding: '8px 0',
            }}
          >
            Volver al dashboard
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
            MI PERFIL
          </h2>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: 32,
            marginBottom: 24,
          }}
        >
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 4 }}>
            EMAIL
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{profile.email}</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 4 }}>
            NOMBRE ACTUAL
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{profile.name}</div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 4 }}>
            ROL
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              border: profile.role === 'ADMIN' ? '1px solid var(--badge-admin-border)' : '1px solid var(--badge-user-border)',
              color: profile.role === 'ADMIN' ? 'var(--badge-admin-text)' : 'var(--badge-user-text)',
              backgroundColor: profile.role === 'ADMIN' ? 'var(--bg-badge-soft)' : 'transparent',
            }}>
              {profile.role === 'ADMIN' ? 'ADMINISTRADOR' : 'USUARIO'}
            </span>
          </div>
        </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: 32,
            marginBottom: 24,
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>
            EDITAR NOMBRE
          </h3>

          <form onSubmit={handleUpdateName}>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>NOMBRE</label>
              <input
                type="text"
                value={editName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button type="submit" disabled={savingName} style={primaryBtnStyle}>
                {savingName ? 'GUARDANDO...' : 'GUARDAR'}
              </button>
              {nameSuccess && (
                <span style={{ fontSize: 13, color: 'var(--success-color)' }}>Nombre actualizado</span>
              )}
            </div>
          </form>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: 32,
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>
            CAMBIAR CONTRASENA
          </h3>

          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>CONTRASENA ACTUAL</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>NUEVA CONTRASENA</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>CONFIRMAR CONTRASENA</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button type="submit" disabled={savingPassword} style={primaryBtnStyle}>
                {savingPassword ? 'GUARDANDO...' : 'CAMBIAR CONTRASENA'}
              </button>
              {passwordSuccess && (
                <span style={{ fontSize: 13, color: 'var(--success-color)' }}>Contrasena actualizada</span>
              )}
            </div>
            {passwordError && (
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--error-color)' }}>
                {passwordError}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

function Header({ navigate, logout, userName }: { navigate: (path: string) => void; logout: () => void; userName: string | null }) {
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
            style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}
            onClick={() => navigate('/tickets')}
          >
            TICKETS
          </span>
        </nav>
        <NotificationBell />
        <ThemeToggle />
        <span
          style={{ fontSize: 13, color: 'var(--header-active-nav)', fontWeight: 700, cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
        >
          {userName}
        </span>
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
  padding: '14px 32px',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 1.5,
  color: 'var(--text-on-primary)',
  backgroundColor: 'var(--btn-primary)',
  border: 'none',
  cursor: 'pointer',
}

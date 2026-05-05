import { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate('/tickets')
    } catch {
      setError('Credenciales incorrectas. Inténtalo de nuevo.')
    }
  }

  return (
    <>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
        <ThemeToggle />
      </div>
      <div style={{ height: 6, backgroundColor: 'var(--bg-login-topbar)', width: '100%' }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 6px)',
          backgroundColor: 'var(--bg-page)',
          padding: 40,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            padding: 48,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div
              style={{
                width: 64,
                height: 64,
                border: '2px solid var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 32, height: 32, backgroundColor: 'var(--text-primary)' }} />
            </div>
          </div>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 8,
              color: 'var(--text-primary)',
            }}
          >
            Gestión de Tickets
          </h1>

          <p
            style={{
              fontSize: 14,
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginBottom: 32,
            }}
          >
            Iniciar Sesión
          </p>

          {error && (
            <p
              style={{
                fontSize: 13,
                color: 'var(--error-color)',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 15,
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                CONTRASEÑA
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 15,
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px 0',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: 'var(--text-on-primary)',
                backgroundColor: 'var(--btn-primary)',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

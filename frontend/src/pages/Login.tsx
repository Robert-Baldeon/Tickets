import { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
      <div style={{ height: 6, backgroundColor: '#1a1f2e', width: '100%' }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 6px)',
          backgroundColor: '#ffffff',
          padding: 40,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            border: '1px solid #e0e0e0',
            backgroundColor: '#ffffff',
            padding: 48,
          }}
        >
          {/* Logo placeholder */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div
              style={{
                width: 64,
                height: 64,
                border: '2px solid #1a1f2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 32, height: 32, backgroundColor: '#1a1f2e' }} />
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 8,
              color: '#1a1f2e',
            }}
          >
            Gestión de Tickets
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 14,
              textAlign: 'center',
              color: '#888888',
              marginBottom: 32,
            }}
          >
            Iniciar Sesión
          </p>

          {/* Error message */}
          {error && (
            <p
              style={{
                fontSize: 13,
                color: '#d32f2f',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 24 }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: '#1a1f2e',
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
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#ffffff',
                  color: '#1a1f2e',
                  outline: 'none',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 32 }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: '#1a1f2e',
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
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#ffffff',
                  color: '#1a1f2e',
                  outline: 'none',
                }}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px 0',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: '#ffffff',
                backgroundColor: '#1a1f2e',
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

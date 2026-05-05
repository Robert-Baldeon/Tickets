import { createContext, useContext, useState, ReactNode } from 'react'
import api from '../services/api'

interface AuthResponse {
  token: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  token: string | null
  email: string | null
  name: string | null
  role: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateName: (newName: string) => void
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'))
  const [name, setName] = useState<string | null>(localStorage.getItem('name'))
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'))
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data }: { data: AuthResponse } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      setEmail(data.email)
      setName(data.name)
      setRole(data.role)
      localStorage.setItem('token', data.token)
      localStorage.setItem('email', data.email)
      localStorage.setItem('name', data.name)
      localStorage.setItem('role', data.role)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateName = (newName: string) => {
    setName(newName)
    localStorage.setItem('name', newName)
  }

  const logout = () => {
    setToken(null)
    setEmail(null)
    setName(null)
    setRole(null)
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('name')
    localStorage.removeItem('role')
  }

  return (
    <AuthContext.Provider value={{ token, email, name, role, login, logout, updateName, isAdmin: role === 'ADMIN', isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

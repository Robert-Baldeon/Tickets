import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import TicketList from './pages/TicketList'
import TicketForm from './pages/TicketForm'
import TicketDetail from './pages/TicketDetail'
import OfflineBanner from './components/OfflineBanner'
import ErrorBoundary from './components/ErrorBoundary'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  const { token } = useAuth()

  return (
    <>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/tickets" /> : <Navigate to="/login" />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute>
              <TicketForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/edit/:id"
          element={
            <ProtectedRoute>
              <TicketForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketList />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={token ? <Navigate to="/tickets" /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App

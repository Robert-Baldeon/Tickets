import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-page)' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 32, maxWidth: 480, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              ERROR
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
              {this.state.error?.message || 'Algo salio mal'}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/tickets'
              }}
              style={{
                padding: '8px 24px',
                backgroundColor: 'var(--btn-primary)',
                color: 'var(--text-on-primary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              VOLVER A TICKETS
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

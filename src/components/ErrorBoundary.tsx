// src/components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  // Captura erros síncronos
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  // Captura erros assíncronos
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary capturou:', error, errorInfo)
    this.setState({ hasError: true, error })
  }

  // Adiciona listener para erros globais
  public componentDidMount() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
    window.addEventListener('error', this.handleGlobalError)
  }

  public componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
    window.removeEventListener('error', this.handleGlobalError)
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason)
    this.setState({ 
      hasError: true, 
      error: event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    })
    event.preventDefault()
  }

  private handleGlobalError = (event: ErrorEvent) => {
    console.error('Global error:', event.error)
    this.setState({ 
      hasError: true, 
      error: event.error instanceof Error ? event.error : new Error(String(event.error))
    })
    event.preventDefault()
  }

  private resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Algo deu errado</h2>
            <p className="text-muted-foreground mb-6">
              {this.state.error?.message || 'Erro desconhecido'}
            </p>
            <button
              onClick={this.resetError}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@/api/config'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const verifyToken = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      setIsAuthenticated(false)
      return
    }

    try {
      const response = await api.get('/api/auth/me')
      setUser(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    verifyToken()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email })
      const response = await api.post('/api/auth/login', { email, password })
      console.log('Login response:', response.data)
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      setIsAuthenticated(true)
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Login failed. Please try again.')
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting registration with:', { email, name })
      const response = await api.post('/api/auth/register', { email, password, name })
      console.log('Registration response:', response.data)
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      setIsAuthenticated(true)
    } catch (error: any) {
      console.error('Registration error:', error)
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Registration failed. Please try again.')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user data
      axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data)
        setIsAuthenticated(true)
      })
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
        setIsAuthenticated(false)
      })
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
    setIsAuthenticated(true)
  }

  const register = async (email: string, password: string, name: string) => {
    const response = await axios.post('/api/auth/register', { email, password, name })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
    setIsAuthenticated(true)
  }

  const logout = async () => {
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
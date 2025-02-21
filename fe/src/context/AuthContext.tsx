import { createContext, useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JWTPayload, User } from '../types/jwtPayload'
import { authApi } from '../services/auth/authApi'
import { LoginReqDto } from '../services/auth/dto/loginReqDto'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (dto: LoginReqDto) => Promise<void>
  logout: () => Promise<void>
  setIsAuthenticated: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function decodeJWT(token: string): JWTPayload {
  try {
    const base64Payload = token.split('.')[1]
    const payload = JSON.parse(atob(base64Payload))
    return payload
  } catch (error) {
    throw new Error('Invalid JWT token')
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from stored token on mount
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const payload = decodeJWT(token)
        return {
          id: payload.id,
          username: payload.username,
          email: payload.email
        }
      } catch {
        localStorage.removeItem('accessToken')
        return null
      }
    }
    return null
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const setIsAuthenticated = useCallback((value: boolean) => {
    if (!value) {
      logout()
    }
  }, [])

  const login = async (dto: LoginReqDto) => {
    const { username, password } = dto
    try {
      setLoading(true)
      const { accessToken } = await authApi.login({ username, password })
      const payload = decodeJWT(accessToken)
      const userData: User = {
        id: payload.id,
        username: payload.username,
        email: payload.email
      }
      setUser(userData)
      localStorage.setItem('accessToken', accessToken)
      navigate('/')
    } catch (error) {
      console.error('Failed to decode JWT token:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authApi.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('accessToken')
      navigate('/login')
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setIsAuthenticated }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

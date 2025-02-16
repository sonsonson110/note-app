import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  username: string
  email: string | null
}

interface AuthContextType {
  user: User | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  const login = (token: string) => {
    localStorage.setItem('accessToken', token)
    setUser(user)
    navigate('/')
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
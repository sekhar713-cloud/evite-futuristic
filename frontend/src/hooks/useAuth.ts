import { useState, useEffect, createContext, useContext } from 'react'
import type { User } from '../types'
import { api } from '../api/client'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export function useAuthProvider(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (api.isAuthenticated()) {
      api.getMe()
        .then(setUser)
        .catch(() => { api.clearToken(); setUser(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { access_token } = await api.login({ email, password })
    api.setToken(access_token)
    const me = await api.getMe()
    setUser(me)
  }

  const register = async (email: string, username: string, password: string) => {
    const { access_token } = await api.register({ email, username, password })
    api.setToken(access_token)
    const me = await api.getMe()
    setUser(me)
  }

  const logout = () => {
    api.clearToken()
    setUser(null)
  }

  return { user, loading, login, register, logout }
}

export function useAuth() {
  return useContext(AuthContext)
}

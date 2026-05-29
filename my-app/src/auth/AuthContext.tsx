import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'

interface StoredUser extends User {
  password: string
}

const USERS: StoredUser[] = [
  {
    id: '1',
    username: 'usuario1',
    password: 'password1',
    name: 'Usuario Demo',
    organization: 'Conéctate Cartagena',
    role: 'Joven Participante',
    initial: 'U',
    type: 'youth',
  },
  {
    id: '2',
    username: 'empresa2',
    password: 'password2',
    name: 'Fundación Mi Sangre',
    organization: 'Fundación Mi Sangre',
    role: 'Organización',
    initial: 'E',
    type: 'organization',
  },
]

const STORAGE_KEY = 'cc_user'

interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (username, password) => {
        const match = USERS.find(
          (u) => u.username === username.trim() && u.password === password,
        )
        if (!match) return false
        const { password: _pw, ...safeUser } = match
        void _pw
        setUser(safeUser)
        return true
      },
      logout: () => setUser(null),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '../types'
import { DEMO_ACCOUNTS } from '../constants'
import { mockStudents, mockStaff, mockAdmin } from '../mock/data'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

const ALL_USERS = [...mockStudents, ...mockStaff, mockAdmin]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        await new Promise(r => setTimeout(r, 800))
        const account = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password)
        if (!account) {
          set({ isLoading: false, error: 'Invalid email or password.' })
          return false
        }
        const user = ALL_USERS.find(u => u.email === email) || {
          id: 'demo', name: account.name, email, role: account.role as UserRole,
          department: 'Demo', isActive: true, createdAt: new Date().toISOString()
        }
        set({ user: user as User, isAuthenticated: true, isLoading: false })
        return true
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      clearError: () => set({ error: null })
    }),
    { name: 'regeo_auth' }
  )
)

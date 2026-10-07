import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification } from '../types'
import { generateNotifications } from '../mock/notifications'

interface NotificationState {
  notifications: Notification[]
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: generateNotifications(),
      addNotification: (n) => set(s => ({
        notifications: [{ ...n, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...s.notifications]
      })),
      markRead: (id) => set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n) })),
      markAllRead: () => set(s => ({ notifications: s.notifications.map(n => ({ ...n, isRead: true })) })),
      clearAll: () => set({ notifications: [] })
    }),
    { name: 'regeo_notifications' }
  )
)

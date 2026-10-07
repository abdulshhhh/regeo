import { Outlet, useLocation } from 'react-router-dom'
import { Sun, Moon, Bell, Menu } from 'lucide-react'
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Sidebar from './Sidebar'
import Avatar from '../components/ui/Avatar'
import { useState } from 'react'

function getBreadcrumb(pathname: string): string {
  const map: Record<string, string> = {
    '/student': 'Dashboard',
    '/student/attendance': 'Mark Attendance',
    '/student/history': 'Attendance History',
    '/student/timetable': 'Timetable',
    '/student/analytics': 'Analytics',
    '/student/notifications': 'Notifications',
    '/student/profile': 'Profile',
    '/staff': 'Dashboard',
    '/staff/live': 'Live Attendance',
    '/staff/students': 'My Students',
    '/staff/timetable': 'Timetable',
    '/staff/reports': 'Reports',
    '/staff/analytics': 'Analytics',
    '/admin': 'Dashboard',
    '/admin/users': 'Users',
    '/admin/students': 'Students',
    '/admin/staff': 'Staff',
    '/admin/classrooms': 'Classrooms',
    '/admin/courses': 'Courses',
    '/admin/timetable': 'Timetable',
    '/admin/analytics': 'Analytics',
    '/admin/reports': 'Reports',
    '/settings': 'Settings',
  }
  return map[pathname] || 'Dashboard'
}

export default function AppLayout() {
  const { theme, toggleTheme } = useUIStore()
  const { user } = useAuthStore()
  const { notifications } = useNotificationStore()
  const location = useLocation()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const unread = notifications.filter(n => !n.isRead).length
  const breadcrumb = getBreadcrumb(location.pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative flex flex-col h-full w-60">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{breadcrumb}</p>
              <p className="text-xs text-slate-400 hidden sm:block">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
              <button className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">{unread}</span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 ml-1">
              <Avatar name={user?.name || 'User'} size="sm" />
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-slate-900 dark:text-white">{user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

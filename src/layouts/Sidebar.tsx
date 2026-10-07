import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MapPin, Clock, BarChart2, User, Bell,
  Users, BookOpen, Calendar, FileText, Settings, Building,
  GraduationCap, LogOut, ChevronLeft, ChevronRight, BookMarked
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import Avatar from '../components/ui/Avatar'
import { useNotificationStore } from '../stores/notificationStore'

const studentNav = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/attendance', label: 'Mark Attendance', icon: MapPin },
  { to: '/student/history', label: 'Attendance History', icon: Clock },
  { to: '/student/timetable', label: 'Timetable', icon: Calendar },
  { to: '/student/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
  { to: '/student/profile', label: 'Profile', icon: User },
]

const staffNav = [
  { to: '/staff', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/staff/live', label: 'Live Attendance', icon: MapPin },
  { to: '/staff/students', label: 'My Students', icon: Users },
  { to: '/staff/timetable', label: 'Timetable', icon: Calendar },
  { to: '/staff/reports', label: 'Reports', icon: FileText },
  { to: '/staff/analytics', label: 'Analytics', icon: BarChart2 },
]

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'All Users', icon: Users },
  { to: '/admin/students', label: 'Students', icon: GraduationCap },
  { to: '/admin/staff', label: 'Staff', icon: BookMarked },
  { to: '/admin/classrooms', label: 'Classrooms', icon: Building },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/timetable', label: 'Timetable', icon: Calendar },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { notifications } = useNotificationStore()
  const navigate = useNavigate()
  const unreadCount = notifications.filter(n => !n.isRead).length

  const navItems = user?.role === 'student' ? studentNav : user?.role === 'staff' ? staffNav : adminNav

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`relative flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'}`}>
      {/* Logo */}
      <div className={`flex items-center h-14 px-4 border-b border-slate-200 dark:border-slate-700 ${sidebarOpen ? 'gap-2' : 'justify-center'}`}>
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <MapPin size={16} className="text-white" />
        </div>
        {sidebarOpen && <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">REGEO</span>}
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white z-10 shadow-sm"
      >
        {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              } ${!sidebarOpen ? 'justify-center' : ''}`
            }
            title={!sidebarOpen ? label : undefined}
          >
            <div className="relative flex-shrink-0">
              <Icon size={18} />
              {label === 'Notifications' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </div>
            {sidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}

        <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              } ${!sidebarOpen ? 'justify-center' : ''}`
            }
          >
            <Settings size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </NavLink>
        </div>
      </nav>

      {/* User info */}
      <div className={`p-3 border-t border-slate-200 dark:border-slate-700 ${sidebarOpen ? '' : 'flex justify-center'}`}>
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

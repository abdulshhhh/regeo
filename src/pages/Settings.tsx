import { useState } from 'react'
import { Sun, Moon, Bell, Shield, Info } from 'lucide-react'
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'

export default function Settings() {
  const { theme, toggleTheme, addToast } = useUIStore()
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState({
    attendance: true,
    lowAttendance: true,
    classReminder: true,
    timetableChange: true,
  })

  const handleSave = () => {
    addToast({ type: 'success', title: 'Settings saved', message: 'Your preferences have been updated.' })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile section */}
      <Card>
        <div className="flex items-center gap-4">
          <Avatar name={user?.name || 'User'} size="xl" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="info">{user?.role}</Badge>
              <Badge variant="default">{user?.department}</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sun size={18} className="text-indigo-500" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</p>
            <p className="text-xs text-slate-400">Choose between light and dark mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-8' : 'translate-x-1'} flex items-center justify-center`}>
              {theme === 'dark' ? <Moon size={10} className="text-indigo-600" /> : <Sun size={10} className="text-slate-500" />}
            </span>
          </button>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-indigo-500" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: 'attendance', label: 'Attendance Marked', desc: 'When your attendance is recorded' },
            { key: 'lowAttendance', label: 'Low Attendance Warning', desc: 'When attendance falls below 75%' },
            { key: 'classReminder', label: 'Class Reminder', desc: '15 minutes before class starts' },
            { key: 'timetableChange', label: 'Timetable Changes', desc: 'When schedule is modified' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => setNotifications(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                className={`relative w-10 h-6 rounded-full transition-colors ${notifications[key as keyof typeof notifications] ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-600'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-indigo-500" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Location Verification</p>
              <p className="text-xs text-slate-400">Verify GPS location when marking attendance</p>
            </div>
            <Badge variant="success">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Identity Verification</p>
              <p className="text-xs text-slate-400">Camera-based identity check for attendance</p>
            </div>
            <Badge variant="success">Enabled</Badge>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-indigo-500" />
          <h2 className="font-semibold text-slate-900 dark:text-white">About</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">App Version</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Platform</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Web (Frontend-only)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Geofence Algorithm</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Haversine Distance</span>
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full">Save Settings</Button>
    </div>
  )
}

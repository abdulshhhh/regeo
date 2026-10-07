import { Bell, CheckCheck, Trash2, AlertTriangle, Calendar, Shield, CheckCircle } from 'lucide-react'
import { useNotificationStore } from '../../stores/notificationStore'
import { useAuthStore } from '../../stores/authStore'
import type { Notification } from '../../types'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'

const typeConfig = {
  attendance_marked: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  low_attendance: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  class_reminder: { icon: Bell, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  timetable_change: { icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  verification_failure: { icon: Shield, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
}

type NotifType = keyof typeof typeConfig

function groupByDate(notifs: Notification[]) {
  const groups: Record<string, Notification[]> = {}
  notifs.forEach(n => {
    const date = n.createdAt.split('T')[0]
    if (!groups[date]) groups[date] = []
    groups[date].push(n)
  })
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
}

export default function Notifications() {
  const { notifications, markRead, markAllRead, clearAll } = useNotificationStore()
  const { user } = useAuthStore()

  const myNotifs = notifications.filter(n => n.userId === user?.id)
  const unread = myNotifs.filter(n => !n.isRead).length
  const groups = groupByDate(myNotifs)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {unread > 0 ? `${unread} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex gap-2">
          {unread > 0 && (
            <Button variant="outline" size="sm" icon={<CheckCheck size={14} />} onClick={markAllRead}>
              Mark all read
            </Button>
          )}
          {myNotifs.length > 0 && (
            <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={clearAll}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {myNotifs.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Bell size={40} />}
            title="No notifications"
            description="You'll see alerts about attendance, class reminders, and more here."
          />
        </Card>
      ) : (
        groups.map(([date, notifs]) => (
          <div key={date}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 px-1">
              {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <div className="space-y-2">
              {notifs.map(n => {
                const config = typeConfig[n.type as NotifType] || typeConfig.attendance_marked
                const { icon: Icon, color, bg } = config
                return (
                  <Card
                    key={n.id}
                    padding="sm"
                    hover
                    onClick={() => markRead(n.id)}
                    className={n.isRead ? 'opacity-70' : ''}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                          {!n.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
                          {new Date(n.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge
                        variant={
                          n.type === 'low_attendance' || n.type === 'verification_failure' ? 'error' :
                          n.type === 'attendance_marked' ? 'success' : 'info'
                        }
                        size="sm"
                      >
                        {n.type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

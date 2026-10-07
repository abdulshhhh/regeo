import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CheckCircle, XCircle, Clock, TrendingUp, BookOpen, Bell } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { useNotificationStore } from '../../stores/notificationStore'
import { mockCourses, mockTimetable, mockStaff, mockClassrooms } from '../../mock/data'
import { PERIODS } from '../../constants'
import { getCurrentDay, getCurrentPeriod, formatDate } from '../../utils/format'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { records } = useAttendanceStore()
  const { notifications } = useNotificationStore()
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]
  const currentDay = getCurrentDay()
  const currentPeriod = getCurrentPeriod(PERIODS)

  const myRecords = records.filter(r => r.studentId === user?.id)

  // Stats
  const totalClasses = myRecords.length
  const presentCount = myRecords.filter(r => r.status === 'present').length
  const absentCount = myRecords.filter(r => r.status === 'absent').length
  const attendancePct = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0

  // Today's classes
  const todaySchedule = currentDay !== 'weekend'
    ? mockTimetable.filter(t => t.day === currentDay)
    : []

  // Today's attendance count
  const todayRecords = myRecords.filter(r => r.date === today)

  // Current/next class
  const currentClass = currentDay !== 'weekend' && currentPeriod
    ? todaySchedule.find(t => t.period === currentPeriod)
    : null
  const nextClass = currentDay !== 'weekend'
    ? todaySchedule.find(t => t.period > (currentPeriod || 0))
    : null
  const activeClass = currentClass || nextClass

  // 7-day trend
  const trendData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toISOString().split('T')[0]
      const dayRecords = myRecords.filter(r => r.date === dateStr)
      const pct = dayRecords.length > 0 ? Math.round((dayRecords.filter(r => r.status === 'present').length / dayRecords.length) * 100) : 0
      return {
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        attendance: pct,
      }
    })
  }, [myRecords])

  const unreadNotifs = notifications.filter(n => !n.isRead).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {formatDate(new Date())} &bull; {user?.department} &bull; {user?.studentId}
          </p>
        </div>
        <Button icon={<MapPin size={16} />} onClick={() => navigate('/student/attendance')}>
          Mark Attendance
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${attendancePct}%`}
          subtitle={`${presentCount} of ${totalClasses} classes`}
          icon={<TrendingUp size={20} />}
          iconColor={attendancePct >= 75 ? 'text-green-500' : 'text-red-500'}
          trend={{ value: 2.4, label: 'vs last week' }}
        />
        <StatCard
          title="Present"
          value={presentCount}
          subtitle="Total classes attended"
          icon={<CheckCircle size={20} />}
          iconColor="text-green-500"
        />
        <StatCard
          title="Absent"
          value={absentCount}
          subtitle="Classes missed"
          icon={<XCircle size={20} />}
          iconColor="text-red-500"
        />
        <StatCard
          title="Today"
          value={`${todayRecords.filter(r => r.status === 'present').length}/${todaySchedule.length}`}
          subtitle="Classes attended today"
          icon={<Clock size={20} />}
          iconColor="text-blue-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current/Next class */}
        <div className="lg:col-span-2 space-y-4">
          {activeClass && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-indigo-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {currentClass ? 'Current Class' : 'Next Class'}
                </span>
                {currentClass && <Badge variant="success">Live Now</Badge>}
              </div>
              {(() => {
                const course = mockCourses.find(c => c.id === activeClass.courseId)
                const faculty = mockStaff.find(f => f.id === activeClass.facultyId)
                const classroom = mockClassrooms.find(c => c.id === activeClass.classroomId)
                return (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg flex-shrink-0">
                      {activeClass.period}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{course?.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{course?.code} &bull; {faculty?.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span>{activeClass.startTime} - {activeClass.endTime}</span>
                        <span>{classroom?.name}, {classroom?.building}</span>
                        <span>Section {activeClass.section}</span>
                      </div>
                    </div>
                    <Button size="sm" icon={<MapPin size={14} />} onClick={() => navigate('/student/attendance')}>
                      Mark
                    </Button>
                  </div>
                )
              })()}
            </Card>
          )}

          {/* Today's timetable */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-indigo-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Today's Schedule</span>
              <Badge variant="default">{todaySchedule.length} classes</Badge>
            </div>
            {currentDay === 'weekend' ? (
              <p className="text-sm text-slate-400 text-center py-4">No classes today. Enjoy your weekend!</p>
            ) : todaySchedule.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No classes scheduled today.</p>
            ) : (
              <div className="space-y-2">
                {todaySchedule.map(entry => {
                  const course = mockCourses.find(c => c.id === entry.courseId)
                  const classroom = mockClassrooms.find(c => c.id === entry.classroomId)
                  const todayRecord = todayRecords.find(r => r.timetableEntryId === entry.id)
                  const isCurrentPeriod = entry.period === currentPeriod
                  return (
                    <div key={entry.id} className={`flex items-center gap-3 p-3 rounded-lg ${isCurrentPeriod ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isCurrentPeriod ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                        {entry.period}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{course?.name}</p>
                        <p className="text-xs text-slate-400">{entry.startTime}-{entry.endTime} &bull; {classroom?.name}</p>
                      </div>
                      {todayRecord ? (
                        <Badge variant={todayRecord.status === 'present' ? 'success' : 'error'}>
                          {todayRecord.status}
                        </Badge>
                      ) : isCurrentPeriod ? (
                        <Badge variant="warning">Active</Badge>
                      ) : (
                        <Badge variant="default">Upcoming</Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Attendance trend */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-indigo-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">7-Day Trend</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#818cf8' }}
                  formatter={(v) => [`${Number(v)}%`, 'Attendance']}
                />
                <Line type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Notifications */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-indigo-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Alerts</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/student/notifications')}>View all</Button>
            </div>
            {unreadNotifs.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">All caught up!</p>
            ) : (
              <div className="space-y-2">
                {unreadNotifs.map(n => (
                  <div key={n.id} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'low_attendance' ? 'bg-red-500' : n.type === 'attendance_marked' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{n.title}</p>
                      <p className="text-xs text-slate-400 truncate">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

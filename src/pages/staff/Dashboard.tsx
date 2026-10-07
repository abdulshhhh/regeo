import { useState, useEffect, useMemo } from 'react'
import { CheckCircle, XCircle, Clock, BookOpen, Activity } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockTimetable, mockCourses, mockClassrooms, mockStudents } from '../../mock/data'
import { getCurrentDay, getCurrentPeriod, formatDate } from '../../utils/format'
import { PERIODS } from '../../constants'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'

interface AttendanceEvent {
  id: string
  studentName: string
  courseCode: string
  time: string
  status: 'present' | 'absent'
}

export default function StaffDashboard() {
  const { user } = useAuthStore()
  const { records } = useAttendanceStore()
  const [liveEvents, setLiveEvents] = useState<AttendanceEvent[]>([])

  const currentDay = getCurrentDay()
  const currentPeriod = getCurrentPeriod(PERIODS)
  const today = new Date().toISOString().split('T')[0]

  // Staff's timetable entries today
  const todaySchedule = useMemo(() => {
    if (currentDay === 'weekend') return []
    return mockTimetable.filter(t => t.facultyId === user?.id && t.day === currentDay)
  }, [user?.id, currentDay])

  // Stats for today
  const todayRecords = records.filter(r => r.date === today)
  const presentToday = todayRecords.filter(r => r.status === 'present').length
  const absentToday = todayRecords.filter(r => r.status === 'absent').length

  // Simulate live events
  const studentNames = mockStudents.slice(0, 20).map(s => s.name)
  const courseCodes = mockCourses.slice(0, 5).map(c => c.code)

  useEffect(() => {
    // Seed with some events
    const initial: AttendanceEvent[] = Array.from({ length: 5 }, (_, i) => ({
      id: `ev_init_${i}`,
      studentName: studentNames[i],
      courseCode: courseCodes[i % courseCodes.length],
      time: new Date(Date.now() - (5 - i) * 60000).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
      status: Math.random() > 0.15 ? 'present' : 'absent',
    }))
    setLiveEvents(initial)

    const interval = setInterval(() => {
      const newEvent: AttendanceEvent = {
        id: `ev_${Date.now()}`,
        studentName: studentNames[Math.floor(Math.random() * studentNames.length)],
        courseCode: courseCodes[Math.floor(Math.random() * courseCodes.length)],
        time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
        status: Math.random() > 0.15 ? 'present' : 'absent',
      }
      setLiveEvents(prev => [newEvent, ...prev.slice(0, 9)])
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome, {user?.name?.split(' ').slice(0, 2).join(' ')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {formatDate(new Date())} • {user?.department}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Classes" value={todaySchedule.length} subtitle="Scheduled" icon={<BookOpen size={20} />} iconColor="text-indigo-500" />
        <StatCard title="Present Today" value={presentToday} subtitle="Across all classes" icon={<CheckCircle size={20} />} iconColor="text-green-500" />
        <StatCard title="Absent Today" value={absentToday} subtitle="Students absent" icon={<XCircle size={20} />} iconColor="text-red-500" />
        <StatCard title="Total Records" value={records.length} subtitle="All time" icon={<Activity size={20} />} iconColor="text-blue-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's schedule */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-indigo-500" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Today's Schedule</h3>
          </div>
          {currentDay === 'weekend' ? (
            <p className="text-sm text-slate-400 text-center py-8">No classes today.</p>
          ) : todaySchedule.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No classes scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {todaySchedule.map(entry => {
                const course = mockCourses.find(c => c.id === entry.courseId)
                const classroom = mockClassrooms.find(c => c.id === entry.classroomId)
                const isActive = entry.period === currentPeriod
                const classRecords = records.filter(r => r.date === today && r.courseId === entry.courseId)
                const present = classRecords.filter(r => r.status === 'present').length
                return (
                  <div key={entry.id} className={`p-3 rounded-xl flex items-center gap-3 ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {entry.period}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{course?.code} — {course?.name}</p>
                      <p className="text-xs text-slate-400">{entry.startTime}–{entry.endTime} • {classroom?.name} • Sec {entry.section}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge variant={isActive ? 'success' : 'default'} size="sm">{isActive ? 'Active' : `${present} present`}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Live attendance feed */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Live Attendance Feed</h3>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {liveEvents.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <Avatar name={event.studentName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{event.studentName}</p>
                  <p className="text-xs text-slate-400">{event.courseCode} • {event.time}</p>
                </div>
                <Badge variant={event.status === 'present' ? 'success' : 'error'} size="sm">
                  {event.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

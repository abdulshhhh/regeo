import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockTimetable, mockCourses, mockStudents, mockClassrooms } from '../../mock/data'
import { getCurrentDay } from '../../utils/format'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Select from '../../components/ui/Select'
import ProgressBar from '../../components/ui/ProgressBar'

export default function LiveAttendance() {
  const { user } = useAuthStore()
  const { records } = useAttendanceStore()
  const currentDay = getCurrentDay()
  const [selectedEntryId, setSelectedEntryId] = useState('')
  const [liveCount, setLiveCount] = useState(0)

  const today = new Date().toISOString().split('T')[0]

  const myEntries = useMemo(() =>
    currentDay !== 'weekend'
      ? mockTimetable.filter(t => t.facultyId === user?.id && t.day === currentDay)
      : mockTimetable.filter(t => t.facultyId === user?.id && t.day === 'monday'),
    [user?.id, currentDay]
  )

  useEffect(() => {
    if (myEntries.length > 0 && !selectedEntryId) setSelectedEntryId(myEntries[0].id)
  }, [myEntries, selectedEntryId])

  const selectedEntry = myEntries.find(e => e.id === selectedEntryId)
  const course = selectedEntry ? mockCourses.find(c => c.id === selectedEntry.courseId) : null
  const classroom = selectedEntry ? mockClassrooms.find(c => c.id === selectedEntry.classroomId) : null

  // Students who should be in this class (first 30 students for demo)
  const expectedStudents = mockStudents.slice(0, 30).filter(s => s.department === 'CSE' || s.department === 'IT')

  // Their attendance
  const classRecords = useMemo(() => {
    return records.filter(r => r.date === today && r.courseId === (selectedEntry?.courseId || ''))
  }, [records, today, selectedEntry])

  const presentCount = classRecords.filter(r => r.status === 'present').length

  // Simulate more arrivals
  useEffect(() => {
    if (!selectedEntry) return
    let count = presentCount
    const interval = setInterval(() => {
      if (count < expectedStudents.length * 0.85) {
        count += Math.floor(Math.random() * 2) + 1
        setLiveCount(Math.min(count, expectedStudents.length))
      }
    }, 3000)
    setLiveCount(presentCount)
    return () => clearInterval(interval)
  }, [selectedEntryId, presentCount, expectedStudents.length])

  const displayPresent = Math.max(presentCount, liveCount)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Attendance</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Real-time student attendance for your classes</p>
      </div>

      {/* Class selector */}
      <Card padding="sm">
        <Select
          label="Select Class"
          value={selectedEntryId}
          onChange={e => setSelectedEntryId(e.target.value)}
          options={myEntries.map(e => {
            const c = mockCourses.find(c => c.id === e.courseId)
            return { value: e.id, label: `P${e.period} — ${c?.code} (${e.startTime}–${e.endTime})` }
          })}
          placeholder="Select a class..."
        />
      </Card>

      {selectedEntry && course && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card padding="sm">
              <p className="text-xs text-slate-400">Expected</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{expectedStudents.length}</p>
            </Card>
            <Card padding="sm" className="border-green-200 dark:border-green-800">
              <p className="text-xs text-slate-400">Present</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{displayPresent}</p>
            </Card>
            <Card padding="sm" className="border-red-200 dark:border-red-800">
              <p className="text-xs text-slate-400">Absent</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{expectedStudents.length - displayPresent}</p>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {course.code} — Live Status
                </span>
              </div>
              <Badge variant="info">{Math.round((displayPresent / expectedStudents.length) * 100)}% present</Badge>
            </div>
            <ProgressBar value={displayPresent} max={expectedStudents.length} color="green" showLabel className="mb-4" />
            <p className="text-xs text-slate-400 mb-4">{classroom?.name}, {classroom?.building} • Geofence: {classroom?.radius}m</p>

            {/* Student grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto">
              {expectedStudents.map((student, idx) => {
                const isPresent = idx < displayPresent
                return (
                  <div key={student.id} className={`flex items-center gap-2 p-2 rounded-lg ${isPresent ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <Avatar name={student.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{student.name.split(' ')[0]}</p>
                      <p className="text-xs text-slate-400 truncate">{student.studentId}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isPresent ? 'bg-green-500' : 'bg-red-400'}`} />
                  </div>
                )
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

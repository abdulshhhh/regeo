import { useMemo } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockCourses, mockTimetable, mockClassrooms } from '../../mock/data'
import { DAYS, PERIODS } from '../../constants'
import { getCurrentDay, getCurrentPeriod } from '../../utils/format'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

export default function StudentTimetable() {
  const { user } = useAuthStore()
  const { records } = useAttendanceStore()
  const currentDay = getCurrentDay()
  const currentPeriod = getCurrentPeriod(PERIODS)

  const myRecords = records.filter(r => r.studentId === user?.id)

  // Build a grid: period x day -> entry
  const grid = useMemo(() => {
    const result: Record<string, Record<string, typeof mockTimetable[0] | null>> = {}
    PERIODS.forEach(p => {
      result[p.number] = {}
      DAYS.forEach(d => { result[p.number][d] = null })
    })
    mockTimetable.forEach(entry => {
      if (!['c001', 'c002', 'c003', 'c004', 'c015'].includes(entry.courseId)) return
      if (result[entry.period]) {
        result[entry.period][entry.day] = entry
      }
    })
    return result
  }, [])

  const getAttendancePct = (courseId: string) => {
    const courseRecs = myRecords.filter(r => r.courseId === courseId)
    if (courseRecs.length === 0) return null
    return Math.round((courseRecs.filter(r => r.status === 'present').length / courseRecs.length) * 100)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Timetable</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Weekly class schedule</p>
      </div>

      {/* Course attendance summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {['c001', 'c002', 'c003', 'c004', 'c015'].map(cId => {
          const course = mockCourses.find(c => c.id === cId)
          const pct = getAttendancePct(cId)
          if (!course) return null
          return (
            <Card key={cId} padding="sm">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{course.code}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{course.name.split(' ').slice(0, 2).join(' ')}</p>
              {pct !== null && (
                <div className="mt-2">
                  <p className={`text-lg font-bold ${pct >= 75 ? 'text-green-600' : 'text-red-600'}`}>{pct}%</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1">
                    <div className={`h-1 rounded-full ${pct >= 75 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Weekly grid */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="w-20 text-left p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Period</th>
                {DAYS.map(day => (
                  <th key={day} className={`text-left p-3 text-xs font-semibold uppercase tracking-wide ${day === currentDay ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {day.slice(0, 3)}
                    {day === currentDay && <span className="ml-1 text-xs normal-case text-indigo-400 font-normal">(today)</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map(period => (
                <tr key={period.number} className="border-b border-slate-100 dark:border-slate-800">
                  <td className={`p-3 ${period.number === currentPeriod && !['saturday','sunday'].includes(currentDay) ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
                    <div className="text-xs font-semibold">P{period.number}</div>
                    <div className="text-xs opacity-60">{period.start}</div>
                  </td>
                  {DAYS.map(day => {
                    const entry = grid[period.number]?.[day]
                    const isCurrent = day === currentDay && period.number === currentPeriod
                    const course = entry ? mockCourses.find(c => c.id === entry.courseId) : null
                    const classroom = entry ? mockClassrooms.find(c => c.id === entry.classroomId) : null
                    return (
                      <td key={day} className={`p-2 ${day === currentDay ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                        {entry && course ? (
                          <div className={`p-2 rounded-lg text-xs ${isCurrent ? 'bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-600' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{course.code}</p>
                            <p className="text-slate-500 dark:text-slate-400 truncate">{course.name.split(' ')[0]}</p>
                            <p className="text-slate-400 truncate">{classroom?.name}</p>
                            {isCurrent && <Badge variant="info" size="sm">Now</Badge>}
                          </div>
                        ) : (
                          <div className="h-12 flex items-center justify-center text-slate-200 dark:text-slate-700 text-xs">-</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

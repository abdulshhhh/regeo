import { useMemo } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { mockTimetable, mockCourses, mockClassrooms } from '../../mock/data'
import { DAYS, PERIODS } from '../../constants'
import { getCurrentDay, getCurrentPeriod } from '../../utils/format'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

export default function StaffTimetable() {
  const { user } = useAuthStore()
  const currentDay = getCurrentDay()
  const currentPeriod = getCurrentPeriod(PERIODS)

  const grid = useMemo(() => {
    const result: Record<number, Record<string, typeof mockTimetable[0] | null>> = {}
    PERIODS.forEach(p => {
      result[p.number] = {}
      DAYS.forEach(d => { result[p.number][d] = null })
    })
    mockTimetable.filter(t => t.facultyId === user?.id).forEach(entry => {
      if (result[entry.period]) result[entry.period][entry.day] = entry
    })
    return result
  }, [user?.id])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Timetable</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Weekly class schedule</p>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="w-20 text-left p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Period</th>
                {DAYS.map(day => (
                  <th key={day} className={`text-left p-3 text-xs font-semibold uppercase tracking-wide ${day === currentDay ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {day.slice(0, 3)}{day === currentDay ? ' (today)' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map(period => (
                <tr key={period.number} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="p-3 text-xs text-slate-400">
                    <div className="font-semibold">P{period.number}</div>
                    <div className="opacity-60">{period.start}</div>
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
                            <p className="text-slate-400 truncate">{classroom?.name}</p>
                            <p className="text-slate-400">Sec {entry.section}</p>
                            {isCurrent && <Badge variant="info" size="sm">Active</Badge>}
                          </div>
                        ) : (
                          <div className="h-12 flex items-center justify-center text-slate-200 dark:text-slate-700 text-xs">—</div>
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

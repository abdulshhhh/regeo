import { useMemo } from 'react'
import { mockTimetable, mockCourses, mockStaff, mockClassrooms } from '../../mock/data'
import { DAYS, PERIODS } from '../../constants'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

export default function AdminTimetable() {
  const grid = useMemo(() => {
    const result: Record<number, Record<string, typeof mockTimetable[0][]>> = {}
    PERIODS.forEach(p => {
      result[p.number] = {}
      DAYS.forEach(d => { result[p.number][d] = [] })
    })
    mockTimetable.forEach(entry => {
      if (result[entry.period]) {
        result[entry.period][entry.day] = [...(result[entry.period][entry.day] || []), entry]
      }
    })
    return result
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Timetable</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Institution-wide class schedule</p>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="w-20 text-left p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Period</th>
                {DAYS.map(day => (
                  <th key={day} className="text-left p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {day.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map(period => (
                <tr key={period.number} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="p-3 text-slate-400">
                    <div className="font-semibold">P{period.number}</div>
                    <div className="opacity-60">{period.start}</div>
                  </td>
                  {DAYS.map(day => {
                    const entries = grid[period.number]?.[day] || []
                    return (
                      <td key={day} className="p-2 align-top">
                        {entries.length === 0 ? (
                          <div className="h-12 flex items-center justify-center text-slate-200 dark:text-slate-700">—</div>
                        ) : (
                          <div className="space-y-1">
                            {entries.map(entry => {
                              const course = mockCourses.find(c => c.id === entry.courseId)
                              const faculty = mockStaff.find(f => f.id === entry.facultyId)
                              const classroom = mockClassrooms.find(c => c.id === entry.classroomId)
                              return (
                                <div key={entry.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                  <p className="font-semibold text-slate-800 dark:text-slate-200">{course?.code}</p>
                                  <p className="text-slate-400 truncate">{classroom?.name}</p>
                                  <p className="text-slate-400 truncate">{faculty?.name?.split(' ')[0]}</p>
                                  <Badge variant="default" size="sm">Sec {entry.section}</Badge>
                                </div>
                              )
                            })}
                          </div>
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

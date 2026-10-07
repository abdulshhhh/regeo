import { useState, useMemo } from 'react'
import { Download } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockStudents, mockCourses } from '../../mock/data'
import { exportCSV } from '../../utils/format'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'

export default function StaffReports() {
  const { user } = useAuthStore()
  const { records } = useAttendanceStore()
  const [courseFilter, setCourseFilter] = useState('')

  const myCourses = mockCourses.filter(c => c.facultyId === user?.id)
  const filteredCourses = courseFilter ? myCourses.filter(c => c.id === courseFilter) : myCourses

  const dept = user?.department || 'CSE'
  const students = mockStudents.filter(s => s.department === dept).slice(0, 20)

  const reportData = useMemo(() => {
    return students.map(student => {
      const courseStats = filteredCourses.map(course => {
        const recs = records.filter(r => r.studentId === student.id && r.courseId === course.id)
        const present = recs.filter(r => r.status === 'present').length
        const total = recs.length
        return { course, present, total, pct: total > 0 ? Math.round((present / total) * 100) : 0 }
      })
      const totalPresent = courseStats.reduce((sum, c) => sum + c.present, 0)
      const totalClasses = courseStats.reduce((sum, c) => sum + c.total, 0)
      const overallPct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0
      return { student, courseStats, totalPresent, totalClasses, overallPct }
    })
  }, [students, filteredCourses, records])

  const handleExport = () => {
    const data = reportData.flatMap(({ student, courseStats }) =>
      courseStats.map(({ course, present, total, pct }) => ({
        StudentID: student.studentId,
        Name: student.name,
        Department: student.department,
        Course: course.code,
        CourseName: course.name,
        Present: present,
        Total: total,
        Percentage: `${pct}%`,
        Status: pct >= 75 ? 'OK' : 'Low',
      }))
    )
    exportCSV(data as unknown as Record<string, unknown>[], `staff_report_${new Date().toISOString().split('T')[0]}.csv`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Student attendance reports for your courses</p>
        </div>
        <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>Export CSV</Button>
      </div>

      <Card padding="sm">
        <Select
          label="Filter by Course"
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          options={myCourses.map(c => ({ value: c.id, label: `${c.code} — ${c.name}` }))}
          placeholder="All Courses"
          className="max-w-xs"
        />
      </Card>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                {filteredCourses.map(c => (
                  <th key={c.id} className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{c.code}</th>
                ))}
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Overall</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(({ student, courseStats, overallPct }) => (
                <tr key={student.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.studentId}</p>
                    </div>
                  </td>
                  {courseStats.map(({ course, pct, present, total }) => (
                    <td key={course.id} className="py-3 px-3 text-center">
                      <div className={`text-sm font-semibold ${pct >= 75 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{pct}%</div>
                      <div className="text-xs text-slate-400">{present}/{total}</div>
                    </td>
                  ))}
                  <td className="py-3 px-4 text-center">
                    <Badge variant={overallPct >= 75 ? 'success' : overallPct >= 60 ? 'warning' : 'error'}>
                      {overallPct}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

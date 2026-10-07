import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockStudents, mockCourses } from '../../mock/data'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'

export default function StaffStudents() {
  const { user } = useAuthStore()
  const { records } = useAttendanceStore()
  const [search, setSearch] = useState('')

  // Get courses taught by this staff
  const myCourseIds = mockCourses.filter(c => c.facultyId === user?.id).map(c => c.id)
  const dept = user?.department || 'CSE'

  // Students from same department
  const students = mockStudents.filter(s => s.department === dept || s.department === 'CSE').slice(0, 30)

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.studentId || '').includes(search)
  )

  const getStudentStats = (studentId: string) => {
    const studentRecords = records.filter(r => r.studentId === studentId && myCourseIds.includes(r.courseId))
    const present = studentRecords.filter(r => r.status === 'present').length
    const total = studentRecords.length
    return { present, total, pct: total > 0 ? Math.round((present / total) * 100) : 0 }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Students</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{filtered.length} students</p>
        </div>
        <div className="w-64">
          <Input placeholder="Search name or ID..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={14} />} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(student => {
          const stats = getStudentStats(student.id)
          return (
            <Card key={student.id} hover>
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={student.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{student.name}</p>
                  <p className="text-xs text-slate-400">{student.studentId}</p>
                </div>
                <Badge variant={stats.pct >= 75 ? 'success' : stats.pct >= 60 ? 'warning' : 'error'}>
                  {stats.pct}%
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Attendance</span>
                  <span>{stats.present}/{stats.total}</span>
                </div>
                <ProgressBar value={stats.pct} color={stats.pct >= 75 ? 'green' : stats.pct >= 60 ? 'yellow' : 'red'} size="sm" />
              </div>
              <div className="mt-2 flex gap-1">
                <Badge variant="default" size="sm">{student.department}</Badge>
                {stats.pct < 75 && <Badge variant="error" size="sm">Low attendance</Badge>}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

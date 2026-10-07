import { useState, useMemo } from 'react'
import { Search, Download, Filter, CheckCircle, XCircle } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockCourses, mockTimetable, mockStaff, mockClassrooms } from '../../mock/data'
import { formatDate, exportCSV } from '../../utils/format'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import EmptyState from '../../components/ui/EmptyState'

const PAGE_SIZE = 15

export default function History() {
  const { user } = useAuthStore()
  const { records } = useAttendanceStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [page, setPage] = useState(1)

  const myRecords = records.filter(r => r.studentId === user?.id)

  const myCourses = useMemo(() => {
    const ids = [...new Set(myRecords.map(r => r.courseId))]
    return mockCourses.filter(c => ids.includes(c.id))
  }, [myRecords])

  const filtered = useMemo(() => {
    return myRecords
      .filter(r => {
        if (statusFilter && r.status !== statusFilter) return false
        if (courseFilter && r.courseId !== courseFilter) return false
        if (search) {
          const course = mockCourses.find(c => c.id === r.courseId)
          const term = search.toLowerCase()
          if (!course?.name.toLowerCase().includes(term) && !course?.code.toLowerCase().includes(term) && !r.date.includes(term)) return false
        }
        return true
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [myRecords, statusFilter, courseFilter, search])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const handleExport = () => {
    const data = filtered.map(r => {
      const course = mockCourses.find(c => c.id === r.courseId)
      const entry = mockTimetable.find(t => t.id === r.timetableEntryId)
      const faculty = entry ? mockStaff.find(f => f.id === entry.facultyId) : null
      const classroom = entry ? mockClassrooms.find(c => c.id === entry.classroomId) : null
      return {
        Date: r.date,
        Course: course?.name || '',
        Code: course?.code || '',
        Period: entry?.period || '',
        Time: entry ? `${entry.startTime}-${entry.endTime}` : '',
        Faculty: faculty?.name || '',
        Classroom: classroom?.name || '',
        Status: r.status,
        LocationVerified: r.locationVerified ? 'Yes' : 'No',
        IdentityVerified: r.identityVerified ? 'Yes' : 'No',
        Distance: r.distance ? `${r.distance}m` : '',
      }
    })
    exportCSV(data as unknown as Record<string, unknown>[], `attendance_${user?.studentId}_${new Date().toISOString().split('T')[0]}.csv`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{filtered.length} records found</p>
        </div>
        <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>Export CSV</Button>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search course, code, date..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              leftIcon={<Search size={14} />}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            options={[{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }]}
            placeholder="All Status"
            className="w-36"
          />
          <Select
            value={courseFilter}
            onChange={e => { setCourseFilter(e.target.value); setPage(1) }}
            options={myCourses.map(c => ({ value: c.id, label: c.code }))}
            placeholder="All Courses"
            className="w-40"
          />
          {(search || statusFilter || courseFilter) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter(''); setCourseFilter(''); setPage(1) }}>Clear</Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        {paginated.length === 0 ? (
          <EmptyState title="No records found" description="Try adjusting your search filters" icon={<Filter size={40} />} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {['Date', 'Course', 'Period', 'Faculty', 'Classroom', 'Location', 'Identity', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(record => {
                    const course = mockCourses.find(c => c.id === record.courseId)
                    const entry = mockTimetable.find(t => t.id === record.timetableEntryId)
                    const faculty = entry ? mockStaff.find(f => f.id === entry.facultyId) : null
                    const classroom = entry ? mockClassrooms.find(c => c.id === entry.classroomId) : null
                    return (
                      <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDate(record.date)}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{course?.code}</p>
                            <p className="text-slate-400 text-xs truncate max-w-32">{course?.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-center">P{entry?.period}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">{faculty?.name?.split(' ').slice(0, 2).join(' ')}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs">{classroom?.name}</td>
                        <td className="py-3 px-4 text-center">
                          {record.locationVerified
                            ? <CheckCircle size={16} className="text-green-500 mx-auto" />
                            : <XCircle size={16} className="text-red-400 mx-auto" />
                          }
                        </td>
                        <td className="py-3 px-4 text-center">
                          {record.identityVerified
                            ? <CheckCircle size={16} className="text-green-500 mx-auto" />
                            : <XCircle size={16} className="text-red-400 mx-auto" />
                          }
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'error'}>
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-400">Showing {(page-1)*PAGE_SIZE+1}-{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, page - 2) + i
                    if (p > totalPages) return null
                    return (
                      <Button key={p} variant={p === page ? 'primary' : 'ghost'} size="sm" onClick={() => setPage(p)}>{p}</Button>
                    )
                  })}
                  <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

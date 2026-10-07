import { useState } from 'react'
import { Search, Download, UserPlus } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockStudents } from '../../mock/data'
import { exportCSV } from '../../utils/format'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import { DEPARTMENTS } from '../../constants'

const PAGE_SIZE = 15

export default function AdminStudents() {
  const { addToast } = useUIStore()
  const { records } = useAttendanceStore()
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [page, setPage] = useState(1)

  const filtered = mockStudents.filter(s => {
    if (deptFilter && s.department !== deptFilter) return false
    if (search) {
      const t = search.toLowerCase()
      return s.name.toLowerCase().includes(t) || (s.studentId || '').includes(t)
    }
    return true
  })

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const getStats = (id: string) => {
    const recs = records.filter(r => r.studentId === id)
    const p = recs.filter(r => r.status === 'present').length
    return { pct: recs.length > 0 ? Math.round((p / recs.length) * 100) : 0, total: recs.length, present: p }
  }

  const handleExport = () => {
    const data = filtered.map(s => {
      const stats = getStats(s.id)
      return { Name: s.name, StudentID: s.studentId, Department: s.department, Email: s.email, Phone: s.phone, AttendancePct: `${stats.pct}%`, Present: stats.present, Total: stats.total }
    })
    exportCSV(data as unknown as Record<string, unknown>[], 'students_export.csv')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Students</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{filtered.length} students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>Export</Button>
          <Button icon={<UserPlus size={16} />} onClick={() => addToast({ type: 'info', title: 'Coming Soon' })}>Add Student</Button>
        </div>
      </div>

      <Card padding="sm">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48">
            <Input placeholder="Search name or ID..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} leftIcon={<Search size={14} />} />
          </div>
          <Select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1) }} options={DEPARTMENTS.map(d => ({ value: d, label: d }))} placeholder="All Departments" className="w-44" />
        </div>
      </Card>

      <Card padding="none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {['Student', 'Dept', 'Email', 'Phone', 'Attendance', 'Status'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(s => {
              const stats = getStats(s.id)
              return (
                <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={s.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><Badge variant="default" size="sm">{s.department}</Badge></td>
                  <td className="py-3 px-4 text-xs text-slate-400">{s.email}</td>
                  <td className="py-3 px-4 text-xs text-slate-400">{s.phone}</td>
                  <td className="py-3 px-4 w-40">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={stats.pct} color={stats.pct >= 75 ? 'green' : 'red'} size="sm" className="flex-1" />
                      <span className={`text-xs font-bold flex-shrink-0 ${stats.pct >= 75 ? 'text-green-600' : 'text-red-600'}`}>{stats.pct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><Badge variant={s.isActive ? 'success' : 'error'}>{s.isActive ? 'Active' : 'Inactive'}</Badge></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

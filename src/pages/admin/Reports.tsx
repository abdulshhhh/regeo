import { useState, useMemo } from 'react'
import { Download } from 'lucide-react'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockStudents } from '../../mock/data'
import { exportCSV } from '../../utils/format'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { DEPARTMENTS } from '../../constants'

export default function AdminReports() {
  const { records } = useAttendanceStore()
  const [deptFilter, setDeptFilter] = useState('')
  const [thresholdFilter, setThresholdFilter] = useState('')

  const reportData = useMemo(() => {
    return mockStudents
      .filter(s => !deptFilter || s.department === deptFilter)
      .map(student => {
        const recs = records.filter(r => r.studentId === student.id)
        const present = recs.filter(r => r.status === 'present').length
        const pct = recs.length > 0 ? Math.round((present / recs.length) * 100) : 0
        return { student, present, total: recs.length, pct }
      })
      .filter(d => {
        if (thresholdFilter === 'low') return d.pct < 75
        if (thresholdFilter === 'critical') return d.pct < 60
        if (thresholdFilter === 'ok') return d.pct >= 75
        return true
      })
      .sort((a, b) => a.pct - b.pct)
  }, [records, deptFilter, thresholdFilter])

  const handleExport = () => {
    const data = reportData.map(({ student, present, total, pct }) => ({
      StudentID: student.studentId || '',
      Name: student.name,
      Department: student.department,
      Email: student.email,
      Present: present,
      Total: total,
      Percentage: `${pct}%`,
      Status: pct >= 75 ? 'OK' : pct >= 60 ? 'Warning' : 'Critical',
    }))
    exportCSV(data as unknown as Record<string, unknown>[], `admin_report_${new Date().toISOString().split('T')[0]}.csv`)
  }

  const critical = reportData.filter(d => d.pct < 60).length
  const warning = reportData.filter(d => d.pct >= 60 && d.pct < 75).length
  const good = reportData.filter(d => d.pct >= 75).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Institution-wide attendance reports</p>
        </div>
        <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>Export CSV</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="sm" className="border-green-200 dark:border-green-800">
          <p className="text-xs text-slate-400">Good (&ge;75%)</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{good}</p>
          <p className="text-xs text-slate-400">students</p>
        </Card>
        <Card padding="sm" className="border-yellow-200 dark:border-yellow-800">
          <p className="text-xs text-slate-400">Warning (60-74%)</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{warning}</p>
          <p className="text-xs text-slate-400">students</p>
        </Card>
        <Card padding="sm" className="border-red-200 dark:border-red-800">
          <p className="text-xs text-slate-400">Critical (&lt;60%)</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{critical}</p>
          <p className="text-xs text-slate-400">students</p>
        </Card>
      </div>

      <Card padding="sm">
        <div className="flex flex-wrap gap-3">
          <Select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
            placeholder="All Departments"
            className="w-44"
          />
          <Select
            value={thresholdFilter}
            onChange={e => setThresholdFilter(e.target.value)}
            options={[
              { value: 'low', label: 'Below 75%' },
              { value: 'critical', label: 'Critical (<60%)' },
              { value: 'ok', label: 'Good (≥75%)' },
            ]}
            placeholder="All Students"
            className="w-44"
          />
        </div>
      </Card>

      <Card padding="none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {['Student', 'Department', 'Present', 'Total', 'Attendance', 'Status'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.slice(0, 30).map(({ student, present, total, pct }) => (
              <tr key={student.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4">
                  <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{student.name}</p>
                  <p className="text-xs text-slate-400">{student.studentId}</p>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="default" size="sm">{student.department}</Badge>
                </td>
                <td className="py-3 px-4 text-slate-500 text-sm">{present}</td>
                <td className="py-3 px-4 text-slate-500 text-sm">{total}</td>
                <td className="py-3 px-4 w-44">
                  <div className="flex items-center gap-2">
                    <ProgressBar
                      value={pct}
                      color={pct >= 75 ? 'green' : pct >= 60 ? 'yellow' : 'red'}
                      size="sm"
                      className="flex-1"
                    />
                    <span className={`text-xs font-bold flex-shrink-0 ${pct >= 75 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {pct}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={pct >= 75 ? 'success' : pct >= 60 ? 'warning' : 'error'}>
                    {pct >= 75 ? 'Good' : pct >= 60 ? 'Warning' : 'Critical'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

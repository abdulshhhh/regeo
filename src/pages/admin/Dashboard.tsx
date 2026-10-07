import { useMemo } from 'react'
import { Users, BookOpen, TrendingUp, GraduationCap } from 'lucide-react'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockStudents, mockStaff, mockCourses } from '../../mock/data'
import { DEPARTMENTS } from '../../constants'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'

export default function AdminDashboard() {
  const { records } = useAttendanceStore()
  const today = new Date().toISOString().split('T')[0]
  const todayRecords = records.filter(r => r.date === today)
  const todayPresent = todayRecords.filter(r => r.status === 'present').length
  const todayPct = todayRecords.length > 0 ? Math.round((todayPresent / todayRecords.length) * 100) : 0

  // Department-wise attendance
  const deptData = useMemo(() => {
    return DEPARTMENTS.map(dept => {
      const deptStudents = mockStudents.filter(s => s.department === dept)
      const deptRecs = records.filter(r => deptStudents.some(s => s.id === r.studentId))
      const present = deptRecs.filter(r => r.status === 'present').length
      const pct = deptRecs.length > 0 ? Math.round((present / deptRecs.length) * 100) : 0
      return { dept, pct, students: deptStudents.length }
    })
  }, [records])

  // Daily trend (last 14 days)
  const dailyTrend = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (13 - i))
      const dateStr = d.toISOString().split('T')[0]
      const dayRecs = records.filter(r => r.date === dateStr)
      const p = dayRecs.filter(r => r.status === 'present').length
      return {
        date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        pct: dayRecs.length > 0 ? Math.round((p / dayRecs.length) * 100) : 0,
        total: dayRecs.length,
      }
    })
  }, [records])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Institution-wide overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={mockStudents.length} subtitle="Active enrolled" icon={<GraduationCap size={20} />} iconColor="text-blue-500" />
        <StatCard title="Faculty" value={mockStaff.length} subtitle="Teaching staff" icon={<Users size={20} />} iconColor="text-green-500" />
        <StatCard title="Courses" value={mockCourses.length} subtitle="Active subjects" icon={<BookOpen size={20} />} iconColor="text-purple-500" />
        <StatCard title="Today's Attendance" value={`${todayPct}%`} subtitle={`${todayPresent} of ${todayRecords.length}`} icon={<TrendingUp size={20} />} iconColor={todayPct >= 75 ? 'text-green-500' : 'text-red-500'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Department-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${Number(v)}%`, 'Attendance']} />
              <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                {deptData.map((d, i) => <Cell key={i} fill={d.pct >= 75 ? '#10b981' : d.pct >= 60 ? '#f59e0b' : '#ef4444'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Daily Attendance Trend (14 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${Number(v)}%`, 'Attendance']} />
              <Line type="monotone" dataKey="pct" stroke="#6366f1" strokeWidth={2} dot={false} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DEPARTMENTS.map(dept => {
          const students = mockStudents.filter(s => s.department === dept).length
          const recs = records.filter(r => mockStudents.filter(s => s.department === dept).some(s => s.id === r.studentId))
          const pct = recs.length > 0 ? Math.round((recs.filter(r => r.status === 'present').length / recs.length) * 100) : 0
          return (
            <Card key={dept} padding="sm">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{dept}</p>
              <p className={`text-xl font-bold mt-1 ${pct >= 75 ? 'text-green-600' : 'text-red-600'}`}>{pct}%</p>
              <p className="text-xs text-slate-400">{students} students</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

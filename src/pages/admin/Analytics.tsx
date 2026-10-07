import { useMemo } from 'react'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockStudents, mockCourses } from '../../mock/data'
import { DEPARTMENTS } from '../../constants'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

export default function AdminAnalytics() {
  const { records } = useAttendanceStore()

  const totalStudents = mockStudents.length
  const totalCourses = mockCourses.length
  const overallPresent = records.filter(r => r.status === 'present').length
  const overallPct = records.length > 0 ? Math.round((overallPresent / records.length) * 100) : 0
  const lowAttendance = mockStudents.filter(s => {
    const recs = records.filter(r => r.studentId === s.id)
    return recs.length > 0 && (recs.filter(r => r.status === 'present').length / recs.length) * 100 < 75
  }).length

  const deptData = useMemo(() => DEPARTMENTS.map(dept => {
    const students = mockStudents.filter(s => s.department === dept)
    const recs = records.filter(r => students.some(s => s.id === r.studentId))
    const p = recs.filter(r => r.status === 'present').length
    return { dept, pct: recs.length > 0 ? Math.round((p / recs.length) * 100) : 0, students: students.length }
  }), [records])

  const courseData = useMemo(() => mockCourses.slice(0, 8).map(course => {
    const recs = records.filter(r => r.courseId === course.id)
    const p = recs.filter(r => r.status === 'present').length
    return { course: course.code, pct: recs.length > 0 ? Math.round((p / recs.length) * 100) : 0 }
  }), [records])

  const monthlyData = useMemo(() => {
    const months: Record<string, { present: number; total: number }> = {}
    records.forEach(r => {
      const m = r.date.slice(0, 7)
      if (!months[m]) months[m] = { present: 0, total: 0 }
      months[m].total++
      if (r.status === 'present') months[m].present++
    })
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([m, d]) => ({
      month: new Date(m + '-01').toLocaleDateString('en', { month: 'short' }),
      pct: d.total > 0 ? Math.round((d.present / d.total) * 100) : 0,
    }))
  }, [records])

  const pieData = DEPARTMENTS.map((d, i) => ({
    name: d,
    value: mockStudents.filter(s => s.department === d).length,
    color: COLORS[i],
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Institution-wide insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Attendance" value={`${overallPct}%`} subtitle="All students & courses" icon={<TrendingUp size={20} />} iconColor="text-indigo-500" />
        <StatCard title="Total Students" value={totalStudents} subtitle="Enrolled" icon={<Users size={20} />} iconColor="text-blue-500" />
        <StatCard title="Active Courses" value={totalCourses} subtitle="Running subjects" icon={<BookOpen size={20} />} iconColor="text-green-500" />
        <StatCard title="At Risk" value={lowAttendance} subtitle="Below 75% attendance" icon={<Award size={20} />} iconColor="text-red-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Department Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="dept" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${Number(v)}%`, 'Attendance']} />
              <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                {deptData.map((d, i) => <Cell key={i} fill={d.pct >= 75 ? '#10b981' : '#ef4444'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Students by Department</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${Number(v)}%`, 'Attendance']} />
            <Line type="monotone" dataKey="pct" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} name="Attendance %" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Course-wise Attendance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={courseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
            <XAxis dataKey="course" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${Number(v)}%`, 'Attendance']} />
            <Bar dataKey="pct" fill="#6366f1" radius={[4, 4, 0, 0]} name="Attendance %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

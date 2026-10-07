import { useMemo } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockCourses } from '../../mock/data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import { TrendingUp, BookOpen, Calendar, Award } from 'lucide-react'

export default function StudentAnalytics() {
  const { user } = useAuthStore()
  const { records } = useAttendanceStore()

  const myRecords = records.filter(r => r.studentId === user?.id)
  const present = myRecords.filter(r => r.status === 'present').length
  const total = myRecords.length
  const pct = total > 0 ? Math.round((present / total) * 100) : 0

  // Course-wise data
  const courseData = useMemo(() => {
    const courseIds = [...new Set(myRecords.map(r => r.courseId))]
    return courseIds.map(cId => {
      const course = mockCourses.find(c => c.id === cId)
      const recs = myRecords.filter(r => r.courseId === cId)
      const p = recs.filter(r => r.status === 'present').length
      const pct = recs.length > 0 ? Math.round((p / recs.length) * 100) : 0
      return { course: course?.code || cId, name: course?.name || cId, present: p, total: recs.length, pct }
    }).sort((a, b) => b.pct - a.pct)
  }, [myRecords])

  // Weekly data (last 8 weeks)
  const weeklyData = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (7 * (7 - i)))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      const weekRecs = myRecords.filter(r => {
        const d = new Date(r.date)
        return d >= weekStart && d <= weekEnd
      })
      const p = weekRecs.filter(r => r.status === 'present').length
      const pct = weekRecs.length > 0 ? Math.round((p / weekRecs.length) * 100) : 0
      return {
        week: `W${i + 1}`,
        attendance: pct,
        present: p,
        absent: weekRecs.filter(r => r.status === 'absent').length,
      }
    })
  }, [myRecords])

  // Monthly trend
  const monthlyData = useMemo(() => {
    const months: Record<string, { present: number; total: number }> = {}
    myRecords.forEach(r => {
      const month = r.date.slice(0, 7)
      if (!months[month]) months[month] = { present: 0, total: 0 }
      months[month].total++
      if (r.status === 'present') months[month].present++
    })
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([month, d]) => ({
      month: new Date(month + '-01').toLocaleDateString('en', { month: 'short' }),
      attendance: d.total > 0 ? Math.round((d.present / d.total) * 100) : 0,
    }))
  }, [myRecords])

  // Pie data
  const pieData = [
    { name: 'Present', value: present },
    { name: 'Absent', value: total - present },
  ]

  const streak = useMemo(() => {
    const sorted = myRecords.filter(r => r.status === 'present').map(r => r.date).sort((a, b) => b.localeCompare(a))
    let count = 0
    let prev = ''
    for (const d of sorted) {
      if (!prev) { count = 1; prev = d; continue }
      const diff = (new Date(prev).getTime() - new Date(d).getTime()) / 86400000
      if (diff <= 3) { count++; prev = d } else break
    }
    return count
  }, [myRecords])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Your attendance insights</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall %" value={`${pct}%`} subtitle={`${present}/${total} classes`} icon={<TrendingUp size={20} />} iconColor={pct >= 75 ? 'text-green-500' : 'text-red-500'} />
        <StatCard title="Courses" value={courseData.length} subtitle="Active subjects" icon={<BookOpen size={20} />} iconColor="text-blue-500" />
        <StatCard title="Current Streak" value={`${streak} days`} subtitle="Consecutive attendance" icon={<Award size={20} />} iconColor="text-yellow-500" />
        <StatCard title="Total Days" value={total} subtitle="Classes tracked" icon={<Calendar size={20} />} iconColor="text-indigo-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pie chart */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Overall Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={i === 0 ? '#10b981' : '#ef4444'} />)}
              </Pie>
              <Tooltip formatter={(v) => [v, '']} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <div className="text-center">
              <div className="text-xl font-bold text-green-500">{present}</div>
              <div className="text-xs text-slate-400">Present</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-500">{total - present}</div>
              <div className="text-xs text-slate-400">Absent</div>
            </div>
          </div>
        </Card>

        {/* Course-wise */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Course-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={courseData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} />
              <YAxis type="category" dataKey="course" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={48} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v) => [`${Number(v)}%`, 'Attendance']}
              />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                {courseData.map((entry, i) => <Cell key={i} fill={entry.pct >= 75 ? '#10b981' : '#ef4444'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Weekly bar */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Weekly Attendance (%)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="attendance" fill="#6366f1" radius={[4, 4, 0, 0]} name="Attendance %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Monthly trend */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${Number(v)}%`, 'Attendance']} />
            <Line type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} name="Attendance %" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

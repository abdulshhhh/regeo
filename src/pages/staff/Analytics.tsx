import { useMemo } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { mockStudents, mockCourses } from '../../mock/data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react'

export default function StaffAnalytics() {
  const { user } = useAuthStore()
  const { records } = useAttendanceStore()

  const myCourses = mockCourses.filter(c => c.facultyId === user?.id)
  const dept = user?.department || 'CSE'
  const myStudents = mockStudents.filter(s => s.department === dept).slice(0, 20)

  // Course-wise avg attendance
  const courseData = useMemo(() => myCourses.map(course => {
    const courseRecs = records.filter(r => r.courseId === course.id)
    const uniqueStudents = [...new Set(courseRecs.map(r => r.studentId))]
    const avgPct = uniqueStudents.length > 0
      ? Math.round(uniqueStudents.reduce((sum, sId) => {
          const recs = courseRecs.filter(r => r.studentId === sId)
          return sum + (recs.length > 0 ? (recs.filter(r => r.status === 'present').length / recs.length) * 100 : 0)
        }, 0) / uniqueStudents.length)
      : 0
    return { course: course.code, name: course.name, avgPct, students: uniqueStudents.length }
  }), [myCourses, records])

  // Attendance distribution (how many students in each % range)
  const distribution = useMemo(() => {
    const ranges = [
      { label: '90-100%', min: 90, max: 100, count: 0 },
      { label: '75-89%', min: 75, max: 89, count: 0 },
      { label: '60-74%', min: 60, max: 74, count: 0 },
      { label: '<60%', min: 0, max: 59, count: 0 },
    ]
    myStudents.forEach(student => {
      const recs = records.filter(r => r.studentId === student.id)
      const pct = recs.length > 0 ? Math.round((recs.filter(r => r.status === 'present').length / recs.length) * 100) : 0
      const range = ranges.find(r => pct >= r.min && pct <= r.max)
      if (range) range.count++
    })
    return ranges
  }, [myStudents, records])

  // Weekly trend
  const weeklyTrend = useMemo(() => Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7 * (7 - i))
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6)
    const weekRecs = records.filter(r => {
      const d = new Date(r.date)
      return d >= weekStart && d <= weekEnd && myCourses.some(c => c.id === r.courseId)
    })
    const p = weekRecs.filter(r => r.status === 'present').length
    return { week: `W${i+1}`, pct: weekRecs.length > 0 ? Math.round((p / weekRecs.length) * 100) : 0 }
  }), [records, myCourses])

  const overallAvg = courseData.length > 0 ? Math.round(courseData.reduce((s, c) => s + c.avgPct, 0) / courseData.length) : 0
  const lowAttendance = myStudents.filter(s => {
    const recs = records.filter(r => r.studentId === s.id)
    if (recs.length === 0) return false
    return (recs.filter(r => r.status === 'present').length / recs.length) * 100 < 75
  }).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Course and student attendance insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Attendance" value={`${overallAvg}%`} subtitle="Across all courses" icon={<TrendingUp size={20} />} iconColor="text-indigo-500" />
        <StatCard title="My Courses" value={myCourses.length} subtitle="Active subjects" icon={<BookOpen size={20} />} iconColor="text-blue-500" />
        <StatCard title="Students" value={myStudents.length} subtitle="Under my courses" icon={<Users size={20} />} iconColor="text-green-500" />
        <StatCard title="Low Attendance" value={lowAttendance} subtitle="Below 75%" icon={<Award size={20} />} iconColor="text-red-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Course-wise Average Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={courseData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="course" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${Number(v)}%`, 'Avg Attendance']} />
              <Bar dataKey="avgPct" radius={[4, 4, 0, 0]}>
                {courseData.map((_, i) => <Cell key={i} fill={courseData[i].avgPct >= 75 ? '#10b981' : '#ef4444'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Student Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={distribution} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Weekly Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weeklyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${Number(v)}%`, 'Attendance']} />
            <Line type="monotone" dataKey="pct" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} name="Attendance %" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

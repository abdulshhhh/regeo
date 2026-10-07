import { useState } from 'react'
import { Search, BookPlus } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'
import { mockCourses, mockStaff, mockClassrooms } from '../../mock/data'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import { DEPARTMENTS } from '../../constants'

export default function AdminCourses() {
  const { addToast } = useUIStore()
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')

  const filtered = mockCourses.filter(c => {
    if (deptFilter && c.department !== deptFilter) return false
    if (search) {
      const t = search.toLowerCase()
      return c.name.toLowerCase().includes(t) || c.code.toLowerCase().includes(t)
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Courses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{filtered.length} courses</p>
        </div>
        <Button icon={<BookPlus size={16} />} onClick={() => addToast({ type: 'info', title: 'Coming Soon' })}>Add Course</Button>
      </div>

      <Card padding="sm">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48">
            <Input placeholder="Search name or code..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={14} />} />
          </div>
          <Select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} options={DEPARTMENTS.map(d => ({ value: d, label: d }))} placeholder="All Departments" className="w-44" />
        </div>
      </Card>

      <Card padding="none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {['Code', 'Course Name', 'Department', 'Semester', 'Credits', 'Faculty', 'Classroom'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(course => {
              const faculty = mockStaff.find(s => s.id === course.facultyId)
              const classroom = mockClassrooms.find(c => c.id === course.classroomId)
              return (
                <tr key={course.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400 font-semibold text-xs">{course.code}</td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 text-sm">{course.name}</td>
                  <td className="py-3 px-4"><Badge variant="default" size="sm">{course.department}</Badge></td>
                  <td className="py-3 px-4 text-center text-slate-500 text-xs">{course.semester}</td>
                  <td className="py-3 px-4 text-center text-slate-500 text-xs">{course.credits}</td>
                  <td className="py-3 px-4 text-xs text-slate-500">{faculty?.name?.split(' ').slice(0, 2).join(' ')}</td>
                  <td className="py-3 px-4 text-xs text-slate-400">{classroom?.name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

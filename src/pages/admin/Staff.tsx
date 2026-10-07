import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'
import { mockStaff, mockCourses } from '../../mock/data'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'

export default function AdminStaff() {
  const { addToast } = useUIStore()
  const [search, setSearch] = useState('')

  const filtered = mockStaff.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.staffId || '').includes(search)
  )

  const getCourseCount = (staffId: string) => mockCourses.filter(c => c.facultyId === staffId).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Staff</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{filtered.length} faculty members</p>
        </div>
        <Button icon={<UserPlus size={16} />} onClick={() => addToast({ type: 'info', title: 'Coming Soon' })}>Add Staff</Button>
      </div>

      <Card padding="sm">
        <Input placeholder="Search name or ID..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={14} />} className="max-w-sm" />
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(staff => {
          const courseCount = getCourseCount(staff.id)
          const courses = mockCourses.filter(c => c.facultyId === staff.id)
          return (
            <Card key={staff.id} hover>
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={staff.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{staff.name}</p>
                  <p className="text-xs text-slate-400">{staff.staffId}</p>
                </div>
                <Badge variant={staff.isActive ? 'success' : 'error'} size="sm">{staff.isActive ? 'Active' : 'Off'}</Badge>
              </div>
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Department</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{staff.department}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Courses</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{courseCount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Email</span>
                  <span className="text-slate-400 truncate max-w-32">{staff.email}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {courses.slice(0, 3).map(c => <Badge key={c.id} variant="default" size="sm">{c.code}</Badge>)}
                {courses.length > 3 && <Badge variant="default" size="sm">+{courses.length - 3}</Badge>}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

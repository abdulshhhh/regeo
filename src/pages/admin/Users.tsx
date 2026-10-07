import { useState, useMemo } from 'react'
import { Search, UserPlus, Shield, GraduationCap, BookOpen } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'
import { mockStudents, mockStaff, mockAdmin } from '../../mock/data'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Tabs from '../../components/ui/Tabs'
import type { User } from '../../types'

const allUsers: User[] = [...mockStudents, ...mockStaff, mockAdmin]

const roleIcons = { student: GraduationCap, staff: BookOpen, admin: Shield }

export default function AdminUsers() {
  const { addToast } = useUIStore()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 15

  const filtered = useMemo(() => {
    return allUsers.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (deptFilter && u.department !== deptFilter) return false
      if (search) {
        const t = search.toLowerCase()
        return u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t) || (u.studentId || u.staffId || '').includes(t)
      }
      return true
    })
  }, [search, roleFilter, deptFilter])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const tabs = [
    { id: 'all', label: 'All Users', count: allUsers.length },
    { id: 'student', label: 'Students', count: mockStudents.length },
    { id: 'staff', label: 'Staff', count: mockStaff.length },
    { id: 'admin', label: 'Admin', count: 1 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{filtered.length} users found</p>
        </div>
        <Button icon={<UserPlus size={16} />} onClick={() => addToast({ type: 'info', title: 'Coming Soon', message: 'User creation will be available soon.' })}>
          Add User
        </Button>
      </div>

      <Tabs tabs={tabs} active={roleFilter} onChange={(id) => { setRoleFilter(id); setPage(1) }} />

      <Card padding="sm">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48">
            <Input placeholder="Search name, email, ID..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} leftIcon={<Search size={14} />} />
          </div>
          <Select
            value={deptFilter}
            onChange={e => { setDeptFilter(e.target.value); setPage(1) }}
            options={['CSE', 'ECE', 'IT', 'MECH', 'EEE', 'CIVIL', 'Administration'].map(d => ({ value: d, label: d }))}
            placeholder="All Departments"
            className="w-44"
          />
          {(search || deptFilter) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setDeptFilter(''); setPage(1) }}>Clear</Button>
          )}
        </div>
      </Card>

      <Card padding="none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {['User', 'Role', 'Department', 'ID', 'Email', 'Status'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(u => {
              const Icon = roleIcons[u.role]
              return (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={u.name} size="sm" />
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={u.role === 'admin' ? 'info' : u.role === 'staff' ? 'success' : 'default'}>
                      <Icon size={11} /> {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">{u.department}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs font-mono">{u.studentId || u.staffId || '—'}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{u.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={u.isActive ? 'success' : 'error'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</p>
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

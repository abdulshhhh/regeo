import { useState } from 'react'
import { Mail, Phone, Building, BookOpen, Edit2, Save, X } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { useUIStore } from '../../stores/uiStore'
import { mockCourses } from '../../mock/data'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'

export default function Profile() {
  const { user } = useAuthStore()
  const { records } = useAttendanceStore()
  const { addToast } = useUIStore()
  const [editing, setEditing] = useState(false)
  const [phone, setPhone] = useState(user?.phone || '')
  const [name, setName] = useState(user?.name || '')

  const myRecords = records.filter(r => r.studentId === user?.id)
  const courseIds = [...new Set(myRecords.map(r => r.courseId))]

  const handleSave = () => {
    setEditing(false)
    addToast({ type: 'success', title: 'Profile updated', message: 'Your changes have been saved.' })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your account information</p>
      </div>

      {/* Profile card */}
      <Card>
        <div className="flex items-start gap-4">
          <Avatar name={user?.name || 'User'} size="xl" />
          <div className="flex-1">
            {editing ? (
              <Input value={name} onChange={e => setName(e.target.value)} className="mb-2" />
            ) : (
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="info">{user?.role}</Badge>
              <Badge variant="default">{user?.department}</Badge>
              {user?.studentId && <Badge variant="outline">{user?.studentId}</Badge>}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={editing ? <X size={16} /> : <Edit2 size={16} />}
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </Card>

      {/* Info */}
      <Card>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Phone</p>
              {editing ? (
                <Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1" />
              ) : (
                <p className="text-sm text-slate-700 dark:text-slate-300">{user?.phone || 'Not provided'}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building size={16} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Department</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{user?.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen size={16} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Student ID</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{user?.studentId || 'N/A'}</p>
            </div>
          </div>
        </div>
        {editing && (
          <div className="mt-4 flex justify-end">
            <Button icon={<Save size={16} />} onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </Card>

      {/* Attendance summary */}
      <Card>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Attendance Summary</h3>
        <div className="space-y-3">
          {courseIds.map(cId => {
            const course = mockCourses.find(c => c.id === cId)
            const recs = myRecords.filter(r => r.courseId === cId)
            const present = recs.filter(r => r.status === 'present').length
            const pct = recs.length > 0 ? Math.round((present / recs.length) * 100) : 0
            if (!course) return null
            return (
              <div key={cId}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{course.code}</span>
                    <span className="text-xs text-slate-400 ml-2">{course.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${pct >= 75 ? 'text-green-500' : 'text-red-500'}`}>{pct}%</span>
                </div>
                <ProgressBar value={pct} color={pct >= 75 ? 'green' : 'red'} size="sm" />
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

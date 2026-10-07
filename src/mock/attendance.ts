import type { AttendanceRecord } from '../types'
import { mockTimetable } from './data'

export function generateAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const today = new Date()
  let id = 1

  for (let daysAgo = 90; daysAgo >= 1; daysAgo--) {
    const date = new Date(today)
    date.setDate(today.getDate() - daysAgo)
    const dayOfWeek = date.toLocaleDateString('en', { weekday: 'long' }).toLowerCase()
    if (dayOfWeek === 'saturday' || dayOfWeek === 'sunday') continue

    const dayEntries = mockTimetable.filter(t =>
      t.day === dayOfWeek && ['c001', 'c002', 'c003', 'c004', 'c015'].includes(t.courseId)
    )

    dayEntries.forEach(entry => {
      const isPresent = Math.random() > 0.12
      records.push({
        id: `ar${id++}`,
        studentId: 's001',
        courseId: entry.courseId,
        timetableEntryId: entry.id,
        date: date.toISOString().split('T')[0],
        status: isPresent ? 'present' : 'absent',
        locationVerified: isPresent,
        identityVerified: isPresent,
        distance: isPresent ? Math.floor(Math.random() * 80) + 5 : undefined,
        accuracy: isPresent ? Math.floor(Math.random() * 15) + 5 : undefined,
        markedAt: isPresent ? `${entry.startTime}:${Math.floor(Math.random() * 50).toString().padStart(2, '0')}` : undefined,
      })
    })
  }

  return records
}

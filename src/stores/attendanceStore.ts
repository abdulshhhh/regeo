import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AttendanceRecord } from '../types'
import { generateAttendanceRecords } from '../mock/attendance'

interface AttendanceState {
  records: AttendanceRecord[]
  addRecord: (record: AttendanceRecord) => void
  updateRecord: (id: string, update: Partial<AttendanceRecord>) => void
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set) => ({
      records: generateAttendanceRecords(),
      addRecord: (record) => set(s => ({ records: [...s.records, record] })),
      updateRecord: (id, update) => set(s => ({
        records: s.records.map(r => r.id === id ? { ...r, ...update } : r)
      }))
    }),
    { name: 'regeo_attendance' }
  )
)

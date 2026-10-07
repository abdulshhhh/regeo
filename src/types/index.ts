export type UserRole = 'student' | 'staff' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  studentId?: string
  staffId?: string
  phone?: string
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface Course {
  id: string
  code: string
  name: string
  department: string
  semester: number
  credits: number
  facultyId: string
  classroomId: string
}

export interface Classroom {
  id: string
  name: string
  building: string
  floor: number
  capacity: number
  latitude: number
  longitude: number
  radius: number
  isActive: boolean
}

export interface TimetableEntry {
  id: string
  courseId: string
  facultyId: string
  classroomId: string
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
  period: number
  startTime: string
  endTime: string
  section: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  courseId: string
  timetableEntryId: string
  date: string
  status: 'present' | 'absent' | 'late'
  locationVerified: boolean
  identityVerified: boolean
  distance?: number
  accuracy?: number
  markedAt?: string
}

export interface Notification {
  id: string
  userId: string
  type: 'attendance_marked' | 'low_attendance' | 'class_reminder' | 'timetable_change' | 'verification_failure'
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface GeofenceResult {
  distance: number
  inside: boolean
  accuracy: number
  status: 'verified' | 'outside' | 'low_accuracy' | 'error'
}

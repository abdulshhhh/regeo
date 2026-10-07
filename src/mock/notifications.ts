import type { Notification } from '../types'

export function generateNotifications(): Notification[] {
  return [
    { id: 'n001', userId: 's001', type: 'attendance_marked', title: 'Attendance Marked', message: 'Your attendance for CS301 (Period 1) has been recorded.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'n002', userId: 's001', type: 'low_attendance', title: 'Low Attendance Warning', message: 'Your attendance in CS302 is at 72%. Minimum required is 75%.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 'n003', userId: 's001', type: 'class_reminder', title: 'Class Reminder', message: 'Operating Systems (CS303) starts in 15 minutes in CS-101.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: 'n004', userId: 's001', type: 'timetable_change', title: 'Timetable Update', message: 'CS401 class on Wednesday has been rescheduled to Period 4.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: 'n005', userId: 's001', type: 'verification_failure', title: 'Verification Failed', message: 'Identity verification failed for CS303 on Monday. Contact your faculty.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
    { id: 'n006', userId: 'f001', type: 'attendance_marked', title: 'Class Attendance Complete', message: 'All students have marked attendance for CS301 - Period 1.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { id: 'n007', userId: 'f001', type: 'low_attendance', title: 'Student Low Attendance', message: 'Siddharth Bose (CS21011) has attendance below 75% in CS303.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  ]
}

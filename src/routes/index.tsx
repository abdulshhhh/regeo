import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import ProtectedRoute from './ProtectedRoute'

// Pages - lazy import for better performance but keeping it simple
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Settings from '../pages/Settings'

// Student pages
import StudentDashboard from '../pages/student/Dashboard'
import MarkAttendance from '../pages/student/MarkAttendance'
import History from '../pages/student/History'
import StudentTimetable from '../pages/student/Timetable'
import StudentAnalytics from '../pages/student/Analytics'
import Profile from '../pages/student/Profile'
import Notifications from '../pages/student/Notifications'

// Staff pages
import StaffDashboard from '../pages/staff/Dashboard'
import LiveAttendance from '../pages/staff/LiveAttendance'
import StaffStudents from '../pages/staff/Students'
import StaffTimetable from '../pages/staff/Timetable'
import StaffReports from '../pages/staff/Reports'
import StaffAnalytics from '../pages/staff/Analytics'

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard'
import AdminUsers from '../pages/admin/Users'
import AdminStudents from '../pages/admin/Students'
import AdminStaff from '../pages/admin/Staff'
import AdminClassrooms from '../pages/admin/Classrooms'
import AdminCourses from '../pages/admin/Courses'
import AdminTimetable from '../pages/admin/Timetable'
import AdminAnalytics from '../pages/admin/Analytics'
import AdminReports from '../pages/admin/Reports'

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  {
    path: '/student',
    element: <ProtectedRoute roles={['student']}><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: 'attendance', element: <MarkAttendance /> },
      { path: 'history', element: <History /> },
      { path: 'timetable', element: <StudentTimetable /> },
      { path: 'analytics', element: <StudentAnalytics /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'profile', element: <Profile /> },
    ]
  },
  {
    path: '/staff',
    element: <ProtectedRoute roles={['staff']}><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <StaffDashboard /> },
      { path: 'live', element: <LiveAttendance /> },
      { path: 'students', element: <StaffStudents /> },
      { path: 'timetable', element: <StaffTimetable /> },
      { path: 'reports', element: <StaffReports /> },
      { path: 'analytics', element: <StaffAnalytics /> },
    ]
  },
  {
    path: '/admin',
    element: <ProtectedRoute roles={['admin']}><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'students', element: <AdminStudents /> },
      { path: 'staff', element: <AdminStaff /> },
      { path: 'classrooms', element: <AdminClassrooms /> },
      { path: 'courses', element: <AdminCourses /> },
      { path: 'timetable', element: <AdminTimetable /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'reports', element: <AdminReports /> },
    ]
  },
  {
    path: '/settings',
    element: <ProtectedRoute roles={['student', 'staff', 'admin']}><AppLayout /></ProtectedRoute>,
    children: [{ index: true, element: <Settings /> }]
  },
  { path: '/404', element: <NotFound /> },
  { path: '*', element: <Navigate to="/404" replace /> },
])

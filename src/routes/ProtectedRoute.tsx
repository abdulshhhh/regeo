import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import type { UserRole } from '../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: UserRole[]
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard
    const path = user.role === 'student' ? '/student' : user.role === 'staff' ? '/staff' : '/admin'
    return <Navigate to={path} replace />
  }

  return <>{children}</>
}

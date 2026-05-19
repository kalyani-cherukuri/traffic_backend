import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles.length === 0) return children
  const role = user?.role
  if (!role) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(role)) {
    // Redirect to their default dashboard
    switch (role) {
      case 'CITIZEN':
        return <Navigate to="/citizen" replace />
      case 'TRAFFIC_OFFICER':
        return <Navigate to="/officer" replace />
      case 'REVIEW_OFFICER':
        return <Navigate to="/review" replace />
      case 'ADMIN':
        return <Navigate to="/admin" replace />
      default:
        return <Navigate to="/login" replace />
    }
  }
  return children
}

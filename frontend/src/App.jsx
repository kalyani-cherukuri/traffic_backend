import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LoginPage = React.lazy(() => import('./pages/auth/Login'))
const CitizenDashboard = React.lazy(() => import('./pages/citizen/CitizenDashboard'))
const OfficerDashboard = React.lazy(() => import('./pages/officer/OfficerDashboard'))
const ReviewDashboard = React.lazy(() => import('./pages/review/ReviewDashboard'))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  const role = user.role
  switch (role) {
    case 'CITIZEN':
      return <Navigate to="/citizen" />
    case 'TRAFFIC_OFFICER':
      return <Navigate to="/officer" />
    case 'REVIEW_OFFICER':
      return <Navigate to="/review" />
    case 'ADMIN':
      return <Navigate to="/admin" />
    default:
      return <Navigate to="/login" />
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/citizen/*"
              element={
                <ProtectedRoute allowedRoles={["CITIZEN"]}>
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/officer/*"
              element={
                <ProtectedRoute allowedRoles={["TRAFFIC_OFFICER"]}>
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/review/*"
              element={
                <ProtectedRoute allowedRoles={["REVIEW_OFFICER"]}>
                  <ReviewDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<RoleRedirect />} />
          </Routes>
          <ToastContainer position="top-right" />
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

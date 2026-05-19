import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Smart Traffic System</h1>
          <nav className="flex items-center gap-4">
            {user && user.role === 'CITIZEN' && <Link to="/citizen" className="text-sm">Citizen</Link>}
            {user && user.role === 'TRAFFIC_OFFICER' && <Link to="/officer" className="text-sm">Officer</Link>}
            {user && user.role === 'REVIEW_OFFICER' && <Link to="/review" className="text-sm">Review</Link>}
            {user && user.role === 'ADMIN' && <Link to="/admin" className="text-sm">Admin</Link>}
            {user ? (
              <button className="text-sm text-red-600" onClick={logout}>Logout</button>
            ) : (
              <Link to="/login" className="text-sm">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  )
}

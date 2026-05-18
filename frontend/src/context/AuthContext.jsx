import React, { createContext, useContext, useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const loginWithToken = (token) => {
    if (!token) return
    localStorage.setItem('token', token)
    try {
      const decoded = jwtDecode(token)
      const u = { role: decoded.role || decoded.authorities || 'CITIZEN', name: decoded.sub }
      setUser(u)
    } catch (e) {
      setUser(null)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    if (typeof window !== 'undefined') window.location.href = '/login'
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loginWithToken,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext

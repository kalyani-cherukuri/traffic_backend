import React, { useState } from 'react'
import api from '../../api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Layout from '../../components/Layout'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Email and password required')
    try {
      const res = await api.post('/auth/login', { email, password })
      const token = res?.data?.token
      const role = res?.data?.role
      const userEmail = res?.data?.email || email
      if (!token) throw new Error('No token returned')
      loginWithToken(token, role, userEmail)
      toast.success('Logged in')
      // redirect by role after login
      navigate('/')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || err.message || 'Login failed')
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm">Email</label>
            <input className="w-full border px-2 py-1 rounded" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input type="password" className="w-full border px-2 py-1 rounded" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div className="flex justify-between items-center">
            <button className="bg-blue-600 text-white px-4 py-1 rounded">Login</button>
            <button type="button" onClick={()=>navigate('/register')} className="text-blue-600 underline text-sm">Create account</button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

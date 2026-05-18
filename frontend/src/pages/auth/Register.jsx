import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Layout from '../../components/Layout'
import { createUser } from '../../services/users'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9]{10}$/

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('CITIZEN')
  const navigate = useNavigate()

  const validate = () => {
    if (!name.trim()) return toast.error('Name is required')
    if (!emailRegex.test(email)) return toast.error('Please enter a valid email')
    if (!phoneRegex.test(phoneNumber)) return toast.error('Phone number must be 10 digits')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await createUser({ name, email, phoneNumber, password, role })
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Registration failed'
      toast.error(message)
    }
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="CITIZEN">Citizen</option>
              <option value="TRAFFIC_OFFICER">Traffic Officer</option>
              <option value="REVIEW_OFFICER">Review Officer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Register
            </button>
            <button type="button" onClick={() => navigate('/login')} className="text-blue-600 underline">
              Already have an account?
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

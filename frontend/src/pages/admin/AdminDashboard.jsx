import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import CreateViolationForm from '../../components/CreateViolationForm'
import api from '../../api'
import StatusBadge from '../../components/StatusBadge'
import { toast } from 'react-toastify'
import { getUsers, createUser } from '../../services/users'
import { getViolations } from '../../services/violations'
import {
  getTotalFineCollected,
  getUnpaidTickets,
  getMostCommonViolation,
  getTicketStatusSummary,
  getRevenueByViolation
} from '../../services/analytics'
import { ROLES } from '../../constants/statuses'

// Analytics Dashboard
function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    totalFines: 0,
    unpaidTickets: 0,
    mostCommonViolation: null,
    ticketStatusSummary: [],
    revenueByViolation: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const [fines, unpaid, common, summary, revenue] = await Promise.all([
          getTotalFineCollected(),
          getUnpaidTickets(),
          getMostCommonViolation(),
          getTicketStatusSummary(),
          getRevenueByViolation()
        ])

        setMetrics({
          totalFines: fines.data || 0,
          unpaidTickets: unpaid.data || 0,
          mostCommonViolation: common.data,
          ticketStatusSummary: summary.data || [],
          revenueByViolation: revenue.data || []
        })
      } catch (err) {
        console.error('Failed to load analytics:', err)
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <p className="text-sm font-medium opacity-90">Total Fines Collected</p>
          <p className="text-3xl font-bold mt-2">${metrics.totalFines?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white">
          <p className="text-sm font-medium opacity-90">Unpaid Tickets</p>
          <p className="text-3xl font-bold mt-2">{metrics.unpaidTickets || 0}</p>
        </div>
      </div>

      {/* Most Common Violation */}
      {metrics.mostCommonViolation && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Most Common Violation</h3>
          <p className="text-xl font-bold text-blue-600">{metrics.mostCommonViolation.violationName}</p>
          <p className="text-gray-600 mt-2">Issued {metrics.mostCommonViolation.count} times</p>
        </div>
      )}

      {/* Ticket Status Summary */}
      {metrics.ticketStatusSummary.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Ticket Status Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-semibold text-gray-700">
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {metrics.ticketStatusSummary.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 font-semibold">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue by Violation */}
      {metrics.revenueByViolation.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Revenue by Violation Type</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-semibold text-gray-700">
                  <th className="px-4 py-3">Violation Type</th>
                  <th className="px-4 py-3">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {metrics.revenueByViolation.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{item.violationName}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">${item.totalRevenue?.toFixed(2) || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// User Management Modal
function CreateUserModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'CITIZEN'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.firstName.trim()) {
      toast.error('First name is required')
      return
    }
    if (!formData.lastName.trim()) {
      toast.error('Last name is required')
      return
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return
    }
    if (!formData.password.trim()) {
      toast.error('Password is required')
      return
    }

    setLoading(true)
    try {
      await createUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      })
      toast.success('User created successfully')
      onCreated && onCreated()
      onClose()
    } catch (err) {
      console.error('Failed to create user:', err)
      toast.error(err?.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Create User</h2>
          <button onClick={onClose} className="text-2xl" disabled={loading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            >
              {Object.entries(ROLES).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// User Management Section
function UserManagement() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await getUsers()
      setUsers(res.data || [])
      if (filterRole) {
        setFilteredUsers((res.data || []).filter((u) => u.role === filterRole))
      } else {
        setFilteredUsers(res.data || [])
      }
    } catch (err) {
      console.error('Failed to load users:', err)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (filterRole) {
      setFilteredUsers(users.filter((u) => u.role === filterRole))
    } else {
      setFilteredUsers(users)
    }
  }, [filterRole, users])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading users...</div>
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
          <h3 className="text-lg font-semibold">User Management</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Roles ({users.length})</option>
                {Object.entries(ROLES).map(([key, value]) => {
                  const count = users.filter((u) => u.role === value).length
                  return (
                    <option key={key} value={value}>
                      {value} ({count})
                    </option>
                  )
                })}
              </select>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
            >
              + Create User
            </button>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-t">
                <tr className="text-left text-sm font-semibold text-gray-700">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => fetchUsers()}
        />
      )}
    </>
  )
}

// Global Data Viewers
function GlobalTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      try {
        const res = await api.get('/tickets')
        setTickets(res.data || [])
      } catch (err) {
        console.error('Failed to load tickets:', err)
        toast.error('Failed to load tickets')
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading tickets...</div>
  }

  if (tickets.length === 0) {
    return <div className="text-center py-8 text-gray-600">No tickets found</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
        <h3 className="text-lg font-semibold">All Tickets ({tickets.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-4">Ticket #</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Violation</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Fine</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Issued By</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-900">{t.ticketNumber || t.id}</td>
                <td className="px-6 py-4 text-gray-900">{t.vehicle?.vehicleNumber}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{t.violationType?.violationName}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{t.violationLocation}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">${t.fineAmount?.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={t.ticketStatus || t.status} />
                </td>
                <td className="px-6 py-4 text-gray-700 text-sm">{t.issuedBy?.email || 'System'}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">
                  {new Date(t.createdAt || t.violationDate || '').toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GlobalPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        const res = await api.get('/payments')
        setPayments(res.data || [])
      } catch (err) {
        console.error('Failed to load payments:', err)
        toast.error('Failed to load payments')
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading payments...</div>
  }

  if (payments.length === 0) {
    return <div className="text-center py-8 text-gray-600">No payments found</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
        <h3 className="text-lg font-semibold">All Payments ({payments.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-4">Payment ID</th>
              <th className="px-6 py-4">Ticket ID</th>
              <th className="px-6 py-4">Citizen</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-900">#{p.id}</td>
                <td className="px-6 py-4 text-gray-900">#{p.ticket?.id}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{p.ticket?.issuedTo?.email || 'Unknown'}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">${p.amount?.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={p.paymentStatus || p.status} />
                </td>
                <td className="px-6 py-4 text-gray-700 text-sm">
                  {new Date(p.createdAt || p.paymentDate || '').toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GlobalDisputes() {
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDisputes = async () => {
      setLoading(true)
      try {
        const res = await api.get('/disputes')
        setDisputes(res.data || [])
      } catch (err) {
        console.error('Failed to load disputes:', err)
        toast.error('Failed to load disputes')
      } finally {
        setLoading(false)
      }
    }
    fetchDisputes()
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading disputes...</div>
  }

  if (disputes.length === 0) {
    return <div className="text-center py-8 text-gray-600">No disputes found</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 text-white">
        <h3 className="text-lg font-semibold">All Disputes ({disputes.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-4">Dispute ID</th>
              <th className="px-6 py-4">Ticket #</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Raised By</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {disputes.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-900">#{d.id}</td>
                <td className="px-6 py-4 text-gray-900">#{d.violationTicket?.id}</td>
                <td className="px-6 py-4 text-gray-700 text-sm truncate max-w-xs">{d.disputeReason}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={d.disputeStatus} />
                </td>
                <td className="px-6 py-4 text-gray-700 text-sm">{d.raisedBy?.email}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">
                  {new Date(d.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <Layout>
      <div className="py-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6 gap-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 font-semibold border-b-2 transition ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('violations')}
            className={`py-2 font-semibold border-b-2 transition ${
              activeTab === 'violations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Violations
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 font-semibold border-b-2 transition ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-2 font-semibold border-b-2 transition ${
              activeTab === 'tickets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Tickets
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 font-semibold border-b-2 transition ${
              activeTab === 'payments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`py-2 font-semibold border-b-2 transition ${
              activeTab === 'disputes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Disputes
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'analytics' && <AnalyticsDashboard key={refreshKey} />}

          {activeTab === 'violations' && (
            <div className="grid md:grid-cols-2 gap-6">
              <CreateViolationForm onViolationCreated={() => setRefreshKey((k) => k + 1)} />
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                  <h3 className="text-lg font-semibold">All Violation Types</h3>
                </div>
                <div className="p-6">
                  <ViolationTypesList key={refreshKey} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && <UserManagement key={refreshKey} />}
          {activeTab === 'tickets' && <GlobalTickets key={refreshKey} />}
          {activeTab === 'payments' && <GlobalPayments key={refreshKey} />}
          {activeTab === 'disputes' && <GlobalDisputes key={refreshKey} />}
        </div>
      </div>
    </Layout>
  )
}

// Violation Types List Component
function ViolationTypesList() {
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchViolations = async () => {
      setLoading(true)
      try {
        const res = await getViolations()
        setViolations(res.data || [])
      } catch (err) {
        console.error('Failed to load violations:', err)
        toast.error('Failed to load violations')
      } finally {
        setLoading(false)
      }
    }
    fetchViolations()
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading violation types...</div>
  }

  if (violations.length === 0) {
    return <div className="text-center py-8 text-gray-600">No violation types created yet</div>
  }

  return (
    <div className="space-y-3">
      {violations.map((v) => (
        <div key={v.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
          <h4 className="font-semibold text-gray-900">{v.violationName}</h4>
          <p className="text-gray-600 text-sm mt-1">{v.description}</p>
          <p className="text-green-600 font-semibold mt-2">Base Fine: ${v.baseFineAmount?.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}

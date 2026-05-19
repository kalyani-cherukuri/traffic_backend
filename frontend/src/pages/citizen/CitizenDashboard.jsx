import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import { createVehicle, getVehicles } from '../../services/vehicles'
import { createPayment, getPayments } from '../../services/payments'
import { createDispute, getDisputes } from '../../services/disputes'
import StatusBadge from '../../components/StatusBadge'
import { toast } from 'react-toastify'

function RegisterVehicleForm({ onCreated }) {
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!plate.trim()) {
      toast.error('Vehicle number is required')
      return
    }
    if (!model.trim()) {
      toast.error('Vehicle model is required')
      return
    }

    setLoading(true)
    try {
      await createVehicle({ vehicleNumber: plate.trim(), vehicleType: model.trim() })
      toast.success('Vehicle registered successfully')
      setPlate('')
      setModel('')
      onCreated && onCreated()
    } catch (err) {
      console.error('Failed to register vehicle:', err)
      toast.error(err?.response?.data?.message || 'Failed to register vehicle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg text-gray-800">Register Vehicle</h3>
      <input
        type="text"
        placeholder="Vehicle Number (e.g., ABC-1234)"
        value={plate}
        onChange={(e) => setPlate(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Vehicle Model (e.g., Honda Civic)"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Registering...' : 'Register Vehicle'}
      </button>
    </form>
  )
}

function VehiclesSection() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const res = await getVehicles()
      setVehicles(res.data || [])
    } catch (err) {
      console.error('Failed to load vehicles:', err)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Loading vehicles...</p>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">No vehicles registered yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <h3 className="text-lg font-semibold">My Vehicles</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-4">Vehicle Number</th>
              <th className="px-6 py-4">Vehicle Type</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-900">{v.vehicleNumber}</td>
                <td className="px-6 py-4 text-gray-700">{v.vehicleType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DisputeModal({ ticket, onClose, onDisputed }) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      toast.error('Please provide a dispute reason')
      return
    }

    setLoading(true)
    try {
      await createDispute({
        ticketId: ticket.id,
        disputeReason: reason.trim()
      })
      toast.success('Dispute raised successfully')
      onDisputed && onDisputed()
      onClose()
    } catch (err) {
      console.error('Failed to raise dispute:', err)
      toast.error(err?.response?.data?.message || 'Failed to raise dispute')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Raise Dispute</h2>
          <button
            onClick={onClose}
            className="text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Ticket ID</label>
            <p className="text-gray-900 font-semibold">#{ticket.id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Vehicle</label>
            <p className="text-gray-900">{ticket.vehicle?.vehicleNumber}</p>
          </div>

          <div>
            <label htmlFor="reason" className="text-sm font-medium text-gray-700 mb-2 block">
              Dispute Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you want to dispute this ticket"
              rows="4"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-yellow-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Dispute'}
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

function TicketsTable({ onRefresh }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [disputeTicket, setDisputeTicket] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState({})

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await api.get('/tickets/my')
      setTickets(res.data || [])
    } catch (err) {
      console.error('Failed to load tickets:', err)
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handlePay = async (ticketId) => {
    setPaymentLoading((prev) => ({ ...prev, [ticketId]: true }))
    try {
      await createPayment({ ticketId })
      toast.success('Payment initiated successfully')
      fetchTickets()
    } catch (err) {
      console.error('Failed to initiate payment:', err)
      toast.error(err?.response?.data?.message || 'Failed to initiate payment')
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [ticketId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Loading tickets...</p>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">No tickets issued</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <h3 className="text-lg font-semibold">My Tickets ({tickets.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">Ticket #</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Violation</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Fine Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Issued Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.map((t) => {
                const canPay = t.ticketStatus === 'PENDING_PAYMENT'
                const canDispute = t.ticketStatus !== 'DISPUTED' && t.ticketStatus !== 'CANCELLED'

                return (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{t.ticketNumber || t.id}</td>
                    <td className="px-6 py-4 text-gray-900">{t.vehicle?.vehicleNumber}</td>
                    <td className="px-6 py-4 text-gray-700 text-sm">{t.violationType?.violationName}</td>
                    <td className="px-6 py-4 text-gray-700 text-sm">{t.violationLocation}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">${t.fineAmount || '0.00'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={t.ticketStatus || t.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {new Date(t.createdAt || t.violationDate || '').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 space-x-2 flex">
                      <button
                        onClick={() => handlePay(t.id)}
                        disabled={!canPay || paymentLoading[t.id]}
                        className="bg-green-600 text-white px-3 py-2 rounded font-medium hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        title={canPay ? 'Pay fine' : `Cannot pay - status is ${t.ticketStatus}`}
                      >
                        {paymentLoading[t.id] ? 'Paying...' : 'Pay'}
                      </button>
                      <button
                        onClick={() => setDisputeTicket(t)}
                        disabled={!canDispute}
                        className="bg-yellow-600 text-white px-3 py-2 rounded font-medium hover:bg-yellow-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        title={canDispute ? 'Raise dispute' : 'Cannot dispute - ticket already resolved'}
                      >
                        Dispute
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {disputeTicket && (
        <DisputeModal
          ticket={disputeTicket}
          onClose={() => setDisputeTicket(null)}
          onDisputed={() => {
            fetchTickets()
            onRefresh && onRefresh()
          }}
        />
      )}
    </>
  )
}

function PaymentsHistory({ refreshKey }) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await getPayments()
      setPayments(res.data || [])
    } catch (err) {
      console.error('Failed to load payments:', err)
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [refreshKey])

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Loading payments...</p>
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">No payments yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
        <h3 className="text-lg font-semibold">Payment History ({payments.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-4">Payment ID</th>
              <th className="px-6 py-4">Ticket ID</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-900">#{p.id}</td>
                <td className="px-6 py-4 text-gray-900">#{p.ticket?.id || 'N/A'}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">${p.amount?.toFixed(2) || '0.00'}</td>
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

export default function CitizenDashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <Layout>
      <div className="py-6 space-y-6">
        {/* Top Section: Vehicle Registration and My Vehicles */}
        <div className="grid md:grid-cols-2 gap-6">
          <RegisterVehicleForm onCreated={() => setRefreshKey((k) => k + 1)} />
          <VehiclesSection key={refreshKey} />
        </div>

        {/* Middle Section: Tickets */}
        <TicketsTable onRefresh={() => setRefreshKey((k) => k + 1)} />

        {/* Bottom Section: Payments History */}
        <PaymentsHistory refreshKey={refreshKey} />
      </div>
    </Layout>
  )
}

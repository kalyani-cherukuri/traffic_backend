import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { getDisputes, resolveDispute } from '../../services/disputes'
import { toast } from 'react-toastify'
import StatusBadge from '../../components/StatusBadge'

const DISPUTE_STATUS_COLORS = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CLOSED: 'bg-gray-100 text-gray-800'
}

function DisputeStatusBadge({ status }) {
  const colorClass = DISPUTE_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>
      {status}
    </span>
  )
}

function ReviewDisputeModal({ dispute, onClose, onResolved }) {
  const [resolutionRemark, setResolutionRemark] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResolve = async (status) => {
    if (!resolutionRemark.trim()) {
      toast.error('Please provide a resolution remark')
      return
    }

    setLoading(true)
    try {
      await resolveDispute(dispute.id, {
        status: status,
        resolutionRemark: resolutionRemark.trim()
      })
      toast.success(`Dispute ${status.toLowerCase()}`)
      onResolved()
      onClose()
    } catch (err) {
      console.error('Failed to resolve dispute:', err)
      const errorMessage = err?.response?.data?.message || 'Failed to resolve dispute'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-50 border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Review Dispute #{dispute.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Dispute Status */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Current Status</label>
            <div className="mt-2">
              <DisputeStatusBadge status={dispute.disputeStatus} />
            </div>
          </div>

          {/* Ticket Information */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Ticket Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Ticket Number</label>
                <p className="text-gray-900">{dispute.violationTicket?.ticketNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Vehicle</label>
                <p className="text-gray-900">{dispute.violationTicket?.vehicle?.vehicleNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
                <p className="text-gray-900">{dispute.violationTicket?.vehicle?.vehicleType || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Violation Type</label>
                <p className="text-gray-900">{dispute.violationTicket?.violationType?.violationName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Fine Amount</label>
                <p className="text-gray-900 font-semibold">${dispute.violationTicket?.fineAmount || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Violation Location</label>
                <p className="text-gray-900">{dispute.violationTicket?.violationLocation || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Dispute Details */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Dispute Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Raised By</label>
                <p className="text-gray-900">{dispute.raisedBy?.email || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Dispute Reason</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">{dispute.disputeReason}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Created On</label>
                <p className="text-gray-900">{new Date(dispute.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Resolution Remark */}
          <div className="border-t pt-6">
            <label htmlFor="remark" className="block text-sm font-semibold text-gray-700 mb-2">
              Resolution Remark <span className="text-red-500">*</span>
            </label>
            <textarea
              id="remark"
              value={resolutionRemark}
              onChange={(e) => setResolutionRemark(e.target.value)}
              placeholder="Provide your resolution remarks for this dispute (required)"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">This remark will be recorded with the dispute resolution</p>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6 flex gap-3">
            <button
              onClick={() => handleResolve('APPROVED')}
              disabled={loading || !resolutionRemark.trim()}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : '✓ Approve Dispute'}
            </button>
            <button
              onClick={() => handleResolve('REJECTED')}
              disabled={loading || !resolutionRemark.trim()}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : '✗ Reject Dispute'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DisputeList() {
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  const fetchDisputes = async () => {
    setLoading(true)
    try {
      const res = await getDisputes()
      setDisputes(res.data || [])
    } catch (err) {
      console.error('Failed to load disputes:', err)
      toast.error('Failed to load disputes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDisputes()
  }, [])

  const filteredDisputes = filterStatus
    ? disputes.filter(d => d.disputeStatus === filterStatus)
    : disputes

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">Loading disputes...</p>
      </div>
    )
  }

  if (filteredDisputes.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">No disputes to review</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Filter */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Dispute Review Panel</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 rounded text-gray-800"
              >
                <option value="">All Disputes ({disputes.length})</option>
                <option value="OPEN">OPEN ({disputes.filter(d => d.disputeStatus === 'OPEN').length})</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW ({disputes.filter(d => d.disputeStatus === 'UNDER_REVIEW').length})</option>
                <option value="APPROVED">APPROVED ({disputes.filter(d => d.disputeStatus === 'APPROVED').length})</option>
                <option value="REJECTED">REJECTED ({disputes.filter(d => d.disputeStatus === 'REJECTED').length})</option>
                <option value="CLOSED">CLOSED ({disputes.filter(d => d.disputeStatus === 'CLOSED').length})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Disputes Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">Dispute ID</th>
                <th className="px-6 py-4">Ticket #</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Violation</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Raised By</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredDisputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">#{dispute.id}</td>
                  <td className="px-6 py-4 text-gray-900">{dispute.violationTicket?.ticketNumber || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-900">{dispute.violationTicket?.vehicle?.vehicleNumber || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{dispute.violationTicket?.violationType?.violationName || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm truncate max-w-xs">{dispute.disputeReason}</td>
                  <td className="px-6 py-4">
                    <DisputeStatusBadge status={dispute.disputeStatus} />
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{dispute.raisedBy?.email || 'Unknown'}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{new Date(dispute.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedDispute(dispute)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
                      disabled={dispute.disputeStatus === 'APPROVED' || dispute.disputeStatus === 'REJECTED' || dispute.disputeStatus === 'CLOSED'}
                    >
                      {dispute.disputeStatus === 'APPROVED' || dispute.disputeStatus === 'REJECTED' || dispute.disputeStatus === 'CLOSED' ? 'Resolved' : 'Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedDispute && (
        <ReviewDisputeModal
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
          onResolved={() => fetchDisputes()}
        />
      )}
    </>
  )
}

export default function ReviewDashboard() {
  const { user } = useAuth()

  // Role protection - redirect if not REVIEW_OFFICER
  if (user?.role !== 'REVIEW_OFFICER') {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout>
      <div className="py-6">
        <DisputeList />
      </div>
    </Layout>
  )
}

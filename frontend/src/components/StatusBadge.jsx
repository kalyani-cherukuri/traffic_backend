import React from 'react'
import classNames from 'classnames'

const colorMap = {
  ISSUED: 'bg-blue-100 text-blue-800',
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  DISPUTED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-gray-100 text-gray-800',

  INITIATED: 'bg-yellow-100 text-yellow-800',
  SUCCESS: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',

  OPEN: 'bg-blue-100 text-blue-800',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CLOSED: 'bg-gray-100 text-gray-800',
}

export default function StatusBadge({ status }) {
  const cls = classNames('px-2 py-1 rounded-full text-xs font-semibold', colorMap[status] || 'bg-gray-100 text-gray-800')
  return <span className={cls}>{status}</span>
}

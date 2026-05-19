import React, { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api'

export default function CreateViolationForm({ onViolationCreated }) {
  const [violationName, setViolationName] = useState('')
  const [description, setDescription] = useState('')
  const [baseFineAmount, setBaseFineAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!violationName.trim()) {
      toast.error('Violation name is required')
      return false
    }
    if (!description.trim()) {
      toast.error('Description is required')
      return false
    }
    if (!baseFineAmount) {
      toast.error('Base fine amount is required')
      return false
    }
    const fineAmount = parseFloat(baseFineAmount)
    if (isNaN(fineAmount) || fineAmount <= 0) {
      toast.error('Base fine amount must be a positive number')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    try {
      const payload = {
        violationName: violationName.trim(),
        description: description.trim(),
        baseFineAmount: parseFloat(baseFineAmount)
      }

      await api.post('/violations', payload)

      toast.success('Violation type created successfully')
      setViolationName('')
      setDescription('')
      setBaseFineAmount('')
      onViolationCreated && onViolationCreated()
    } catch (err) {
      console.error('Failed to create violation:', err)
      const errorMessage = err?.response?.data?.message || 'Failed to create violation type'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md">
      <h3 className="text-lg font-semibold text-gray-800">Add Violation Type</h3>

      <div>
        <label htmlFor="violationName" className="block text-sm font-medium text-gray-700 mb-1">
          Violation Name <span className="text-red-500">*</span>
        </label>
        <input
          id="violationName"
          type="text"
          value={violationName}
          onChange={(e) => setViolationName(e.target.value)}
          placeholder="e.g., Signal Jumping"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter violation description"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="baseFineAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Base Fine Amount ($) <span className="text-red-500">*</span>
        </label>
        <input
          id="baseFineAmount"
          type="number"
          step="0.01"
          min="0"
          value={baseFineAmount}
          onChange={(e) => setBaseFineAmount(e.target.value)}
          placeholder="e.g., 250.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Violation Type'}
      </button>
    </form>
  )
}

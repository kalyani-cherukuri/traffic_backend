import api from '../api'

export const createPayment = (payload) => api.post('/payments', payload)
export const getPayments = (params) => api.get('/payments/my', { params })

export default { createPayment, getPayments }

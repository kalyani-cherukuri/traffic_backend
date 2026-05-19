import api from '../api'

export const createDispute = (payload) => api.post('/disputes', payload)
export const resolveDispute = (id, payload) => api.put(`/disputes/${id}/resolve`, payload)
export const getDisputes = () => api.get('/disputes')

export default { createDispute, resolveDispute, getDisputes }

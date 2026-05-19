import api from '../api'

export const createTicket = (payload) => api.post('/tickets', payload)
export const getTickets = (params) => api.get('/tickets', { params })
export const getTicket = (id) => api.get(`/tickets/${id}`)

export default { createTicket, getTickets, getTicket }

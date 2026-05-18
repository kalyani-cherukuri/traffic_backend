import api from '../api'

export const createUser = (payload) => api.post('/users', payload)
export const getUsers = (params) => api.get('/users', { params })

export default { createUser, getUsers }

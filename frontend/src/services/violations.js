import api from '../api'

export const createViolation = (payload) => api.post('/violations', payload)
export const getViolations = () => api.get('/violations')

export default { createViolation, getViolations }

import api from '../api'

export const createVehicle = (payload) => api.post('/vehicles', payload)
export const getVehicles = () => api.get('/vehicles')

export default { createVehicle, getVehicles }

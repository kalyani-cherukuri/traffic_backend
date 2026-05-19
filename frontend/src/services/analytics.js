import api from '../api'

export const getTotalFineCollected = () => api.get('/analytics/total-fines')
export const getUnpaidTickets = () => api.get('/analytics/unpaid-tickets')
export const getMostCommonViolation = () => api.get('/analytics/most-common-violation')
export const getTicketStatusSummary = () => api.get('/analytics/ticket-status-summary')
export const getRevenueByViolation = () => api.get('/analytics/revenue-by-violation')

export default {
  getTotalFineCollected,
  getUnpaidTickets,
  getMostCommonViolation,
  getTicketStatusSummary,
  getRevenueByViolation
}

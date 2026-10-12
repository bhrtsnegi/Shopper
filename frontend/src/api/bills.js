import api from './axios'

export const billsApi = {
  getAll: () => api.get('/bills'),
  getById: (id) => api.get(`/bills/${id}`),
  create: (data) => api.post('/bills', data),
  getStats: () => api.get('/bills/stats'),
}

import api from './axios'

export const stockApi = {
  getAllMovements: () => api.get('/stock/movements'),
  getMovementsForProduct: (id) => api.get(`/stock/movements/product/${id}`),
  addMovement: (data) => api.post('/stock/movements', data),
}

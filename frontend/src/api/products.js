import api from './axios'

export const productsApi = {
  getAll: (search = '') => api.get('/products', { params: search ? { search } : {} }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getLowStock: () => api.get('/products/low-stock'),
  getCategories: () => api.get('/products/categories'),
  getStats: () => api.get('/products/stats'),
}

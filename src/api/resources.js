import { api } from './client';

export const categoriesApi = {
  getAll:  ()           => api.get('/api/categories'),
  create:  (categoryName) => api.post('/api/categories', { categoryName }),
  delete:  (categoryId) => api.delete(`/api/categories/${categoryId}`),
};

export const paymentMethodsApi = {
  getAll:  ()                   => api.get('/api/payment-methods'),
  create:  (paymentName, type)  => api.post('/api/payment-methods', { paymentName, type }),
  delete:  (paymentId)          => api.delete(`/api/payment-methods/${paymentId}`),
};

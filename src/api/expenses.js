import { api } from './client';

export const expensesApi = {
  // GET /api/expenses?year=2025&month=6
  getByMonth: (year, month) =>
    api.get(`/api/expenses?year=${year}&month=${month}`),

  // POST /api/expenses
  create: (dto) => api.post('/api/expenses', dto),

  // PATCH /api/expenses/:id
  update: (expenseId, dto) => api.patch(`/api/expenses/${expenseId}`, dto),

  // DELETE /api/expenses/:id  (soft delete)
  delete: (expenseId) => api.delete(`/api/expenses/${expenseId}`),

  // POST /api/expenses/:id/recon
  addRecon: (expenseId, reconAmount, reconDesc) =>
    api.post(`/api/expenses/${expenseId}/recon`, { expenseId, reconAmount, reconDesc }),

  // DELETE /api/expenses/:id/recon/:reconId
  removeRecon: (expenseId, reconId) =>
    api.delete(`/api/expenses/${expenseId}/recon/${reconId}`),
};

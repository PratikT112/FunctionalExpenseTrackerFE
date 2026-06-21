import { api } from './client';

export const authApi = {
  login:    (email, password) => api.post('/auth/login',    { email, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
};

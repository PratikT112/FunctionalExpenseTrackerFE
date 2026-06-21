import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

function loadStored() {
  try {
    const token = localStorage.getItem('spndx_token');
    const user  = JSON.parse(localStorage.getItem('spndx_user') || 'null');
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const stored = loadStored();
  const [token, setToken] = useState(stored.token);
  const [user,  setUser]  = useState(stored.user);

  const persist = (tokenVal, userVal) => {
    localStorage.setItem('spndx_token', tokenVal);
    localStorage.setItem('spndx_user', JSON.stringify(userVal));
    setToken(tokenVal);
    setUser(userVal);
  };

  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password);
    persist(res.token, { userId: res.userId, username: res.username, email: res.email, role: res.role });
    return res;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const res = await authApi.register(username, email, password);
    persist(res.token, { userId: res.userId, username: res.username, email: res.email, role: res.role });
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('spndx_token');
    localStorage.removeItem('spndx_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/resources';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi.me()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  function storeSession(data) {
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  async function login(payload) {
    const data = await authApi.login(payload);
    storeSession(data);
  }

  async function signup(payload) {
    const data = await authApi.signup(payload);
    storeSession(data);
  }

  async function refreshUser() {
    const data = await authApi.me();
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  const value = useMemo(() => ({
    user,
    loading,
    login,
    signup,
    logout,
    setUser,
    refreshUser,
    isAdmin: user?.role === 'admin'
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

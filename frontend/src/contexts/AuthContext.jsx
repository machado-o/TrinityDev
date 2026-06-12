import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api/client.js';

const AuthCtx = createContext(null);

const STORAGE_KEY = 'sav_user';

function loadUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const login = useCallback(async (email, senha) => {
    const dados = await api.post('/login', { email, senha });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    setUser(dados);
    return dados;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}

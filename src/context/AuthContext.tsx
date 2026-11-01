'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser { email: string }
interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, logout: async () => {}, getToken: async () => null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => setUser(data.authenticated ? data.user : null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    router.push('/login');
  };

  // Authentication is cookie-based; API routes validate the HttpOnly session.
  const getToken = async () => null;

  return <AuthContext.Provider value={{ user, loading, logout, getToken }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  getToken: async () => null,
});

const ALLOWED_EMAILS = [
  'omkarshirvalkar@gmail.com',
  'swayamkhangaonkar2006@gmail.com',
  'chillalsarthak@gmail.com',
  'itiakash14@gmail.com'
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const isAllowed = ALLOWED_EMAILS.includes(currentUser.email?.toLowerCase() || '');
        
        // Strictly enforce allowed emails
        if (!isAllowed) {
          console.error("Unauthorized entry attempt by", currentUser.email);
          await signOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }

        // Strictly enforce email verification for password users
        // Note: Google users are usually verified, but we check anyway for consistency
        const isPasswordProvider = currentUser.providerData.some(p => p.providerId === 'password');
        if (isPasswordProvider && !currentUser.emailVerified) {
          setUser(null); // Keep user state null so they can't access dashboard
          setLoading(false);
          return;
        }

        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

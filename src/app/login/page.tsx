'use client';

import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ALLOWED_EMAILS = [
  'omkarshirvalkar@gmail.com',
  'swayamkhangaonkar2006@gmail.com',
  'chillalsarthak@gmail.com',
  'itiakash14@gmail.com'
];

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    return ALLOWED_EMAILS.includes(email.toLowerCase());
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!auth) {
      setError('Authentication is temporarily unavailable. Please configure Firebase in the deployment environment.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('This email is not authorized for system access.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
          setError('Please verify your email address before logging in. Check your inbox.');
          await signOut(auth);
          setLoading(false);
          return;
        }
        
        router.push('/dashboard/editor');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        await signOut(auth);
        setMessage('Verification link sent! Please check your email and verify before logging in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account already exists with this email.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid credentials. Please try again.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    if (!auth) {
      setError('Authentication is temporarily unavailable. Please configure Firebase in the deployment environment.');
      setLoading(false);
      return;
    }
    
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection so users can switch if they used the wrong email
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      
      if (!validateEmail(result.user.email || '')) {
        setError('Unauthorized account. Access denied.');
        await signOut(auth);
      } else {
        router.push('/dashboard/editor');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '2rem' }}>
      <div style={{ background: '#141414', border: '1px solid #2a2a2a', padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          GHOST PROTOCOL
        </h1>
        <p style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '10px', color: '#a2ff00', letterSpacing: '0.15em', textAlign: 'center', marginBottom: '2rem' }}>
          AUTHORIZED ACCESS ONLY
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', fontSize: '13px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: 'rgba(162, 255, 0, 0.1)', color: '#a2ff00', padding: '0.75rem', fontSize: '13px', marginBottom: '1.5rem', border: '1px solid rgba(162, 255, 0, 0.2)', textAlign: 'center' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="operator@ghost.network"
              style={{ width: '100%', padding: '0.85rem', background: '#0f0f0f', border: '1px solid #333', color: '#fff', fontSize: '14px', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>PASSWORD</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.85rem', background: '#0f0f0f', border: '1px solid #333', color: '#fff', fontSize: '14px', outline: 'none' }} 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: '#a2ff00', color: '#000', padding: '0.85rem', fontWeight: 'bold', 
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, 
              marginTop: '0.5rem', fontSize: '13px', letterSpacing: '0.1em'
            }}
          >
            {loading ? 'PROCESSING...' : isLogin ? 'ENTER SYSTEM' : 'REQUEST ACCESS'}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ height: '1px', background: '#333', flex: 1 }} />
          <span style={{ fontSize: '10px', color: '#555' }}>OR</span>
          <div style={{ height: '1px', background: '#333', flex: 1 }} />
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{ 
            width: '100%', padding: '0.85rem', background: 'transparent', border: '1px solid #333', 
            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', gap: '10px', fontSize: '13px', transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.borderColor = '#555'}
          onMouseOut={e => e.currentTarget.style.borderColor = '#333'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Google Authentication
        </button>

        <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: '#a2ff00', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? "Need access? Request Credentials" : "Back to Login"}
          </button>
          
          {isLogin && (
            <Link href="/forgot-password" style={{ color: '#888', fontSize: '11px', textDecoration: 'none', opacity: 0.6 }}>
              Lost your key? Reset Password
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

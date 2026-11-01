'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import Link from 'next/link';

const ALLOWED_EMAILS = [
  'omkarshirvalkar@gmail.com',
  'swayamkhangaonkar2006@gmail.com',
  'chillalsarthak@gmail.com',
  'itiakash14@gmail.com'
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{type: 'error' | 'success', message: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (!auth) {
      setStatus({ type: 'error', message: 'Authentication is temporarily unavailable. Please configure Firebase in the deployment environment.' });
      setLoading(false);
      return;
    }
    
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      setStatus({ type: 'error', message: 'Unauthorized email. Reset request denied.' });
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus({ type: 'success', message: 'Reset transmission sent. Check your inbox.' });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to find relay. Verify the email.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '2rem' }}>
      <div style={{ background: '#141414', border: '1px solid #2a2a2a', padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', textAlign: 'center' }}>
          RECOVER ACCESS
        </h1>
        <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginBottom: '2rem' }}>
          Enter your email to receive a password reset hyperlink.
        </p>

        {status && (
          <div style={{ 
            background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(162, 255, 0, 0.1)', 
            color: status.type === 'error' ? '#ef4444' : '#a2ff00', 
            padding: '0.75rem', fontSize: '14px', marginBottom: '1.5rem', 
            border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(162, 255, 0, 0.2)'}` 
          }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#0f0f0f', border: '1px solid #333', color: '#fff' }} 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: '#333', color: '#fff', padding: '1rem', fontWeight: 'bold', 
              border: '1px solid #555', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 
            }}
          >
            {loading ? 'TRANSMITTING...' : 'SEND RESET LINK'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/login" style={{ color: '#888', fontSize: '12px', textDecoration: 'underline' }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

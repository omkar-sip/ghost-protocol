'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed.');
      // Reload so the dashboard and AuthProvider read the newly-created
      // HttpOnly session cookie instead of the login page's stale state.
      window.location.assign('/dashboard/editor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '2rem' }}>
      <div style={{ background: '#141414', border: '1px solid #2a2a2a', padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>GHOST PROTOCOL</h1>
        <p style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '10px', color: '#a2ff00', letterSpacing: '0.15em', textAlign: 'center', marginBottom: '2rem' }}>AUTHORIZED ACCESS ONLY</p>
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', fontSize: '13px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '11px', color: '#888' }}>
            EMAIL ADDRESS
            <input type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" style={{ padding: '0.85rem', background: '#0f0f0f', border: '1px solid #333', color: '#fff', fontSize: '14px', outline: 'none' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '11px', color: '#888' }}>
            PASSWORD
            <input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} style={{ padding: '0.85rem', background: '#0f0f0f', border: '1px solid #333', color: '#fff', fontSize: '14px', outline: 'none' }} />
          </label>
          <button type="submit" disabled={loading} style={{ background: '#a2ff00', color: '#000', padding: '0.85rem', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '0.5rem', fontSize: '13px', letterSpacing: '0.1em' }}>{loading ? 'AUTHENTICATING...' : 'ENTER SYSTEM'}</button>
        </form>
      </div>
    </div>
  );
}

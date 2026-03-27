'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const sections = [
  { name: 'Visual Editor', href: '/dashboard/editor', icon: '✨' },
  { name: 'Overview (Legacy)', href: '/dashboard', icon: '◈' },
  { name: 'Hero', href: '/dashboard/hero', icon: '◆' },
  { name: 'Wins', href: '/dashboard/wins', icon: '★' },
  { name: 'Garage', href: '/dashboard/garage', icon: '▣' },
  { name: 'Join', href: '/dashboard/join', icon: '✉' },
  { name: 'Footer', href: '/dashboard/footer', icon: '▬' },
  { name: 'Navigation', href: '/dashboard/navigation', icon: '☰' },
  { name: 'Ticker', href: '/dashboard/ticker', icon: '↔' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ color: '#a2ff00', fontFamily: "'Space Grotesk', monospace", fontSize: '10px', letterSpacing: '0.12em' }}>
          VERIFYING ACCESS...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f' }}>
      {/* Sidebar */}
      {pathname !== '/dashboard/editor' && (
      <aside
        style={{
          width: '260px',
          background: '#141414',
          borderRight: '1px solid #2a2a2a',
          padding: '2rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          overflowY: 'auto',
        }}
      >
        {/* Brand */}
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Epilogue', sans-serif",
              fontWeight: 900,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#a2ff00',
              textDecoration: 'none',
            }}
          >
            GHOST PROTOCOL
          </Link>
          <div
            style={{
              fontFamily: "'Space Grotesk', monospace",
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#555',
              marginTop: '0.4rem',
            }}
          >
            DASHBOARD / CMS
          </div>
        </div>

        {/* Nav items */}
        {sections.map((section) => {
          const isActive = pathname === section.href;
          return (
            <Link
              key={section.name}
              href={section.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#a2ff00' : '#888',
                textDecoration: 'none',
                background: isActive ? 'rgba(162, 255, 0, 0.06)' : 'transparent',
                borderLeft: isActive ? '3px solid #a2ff00' : '3px solid transparent',
                transition: 'all 0.15s',
                letterSpacing: '0.03em',
              }}
            >
              <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>
                {section.icon}
              </span>
              {section.name}
            </Link>
          );
        })}


        {/* Back to site */}
        <div style={{ marginTop: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => logout()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "'Space Grotesk', monospace",
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#ef4444',
              textDecoration: 'none',
              padding: '0.75rem 1rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            ✕ Disconnect Session
          </button>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "'Space Grotesk', monospace",
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#555',
              textDecoration: 'none',
              padding: '0.75rem 1rem',
              border: '1px dashed #333',
              transition: 'all 0.2s',
            }}
          >
            ← View Live Site
          </Link>
        </div>
      </aside>
      )}

      {/* Main content */}
      <main
        style={{
          flex: 1,
          marginLeft: pathname === '/dashboard/editor' ? '0' : '260px',
          padding: pathname === '/dashboard/editor' ? '0' : '2rem 3rem',
          color: '#e0e0e0',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}

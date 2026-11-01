'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionProps } from '@/types/theme';

export default function Navbar({ settings: content }: SectionProps) {
  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoSize = content.logoSize ?? 38;
  const navFontSize = content.navFontSize ?? 14;
  const navFontFamily = content.navFontFamily ?? 'space-grotesk';

  const resolveFontFamily = (fontKey: string) => {
    switch (fontKey) {
      case 'space-grotesk':
      case 'Space Grotesk':
        return 'var(--font-space-grotesk), sans-serif';
      case 'epilogue':
      case 'Epilogue':
        return 'var(--font-epilogue), sans-serif';
      case 'inter':
      case 'Inter':
        return 'var(--font-inter), sans-serif';
      case 'jetbrains-mono':
      case 'JetBrains Mono':
        return 'var(--font-jetbrains-mono), monospace';
      case 'arial':
      case 'Arial':
        return 'Arial, sans-serif';
      case 'georgia':
      case 'Georgia':
        return 'Georgia, serif';
      default:
        return 'var(--font-space-grotesk), sans-serif';
    }
  };

  const navFontStack = resolveFontFamily(navFontFamily);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 60) navRef.current.classList.add('scrolled');
        else navRef.current.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={mobileOpen ? 'open' : ''}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          style={{
            position: 'absolute', top: '2rem', right: '2rem',
            background: 'none', border: 'none', color: '#f9f9f9',
            fontSize: '2rem', cursor: 'pointer'
          }}
        >
          ✕
        </button>
        {content.links.map((link: any) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            style={{ fontFamily: navFontStack, fontSize: `${navFontSize}px` }}
          >
            {link.label}
          </a>
        ))}
        <div className="coord-label" style={{ color: 'rgba(249,249,249,0.3)', fontSize: '9px' }}>
          {content.brand} / ANALOG BLUEPRINT
        </div>
      </div>

      {/* Navigation Bar */}
      <nav
        ref={navRef}
        style={{
          position: 'sticky', top: 0, zIndex: 100, width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.4rem 2rem',
          transition: 'background 0.3s, border-bottom 0.3s'
        }}
      >
        <a
          href="#"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          <Image
            src="/Gemini_Generated_Image_hmk4nbhmk4nbhmk4.png"
            alt={content.brand}
            width={180}
            height={48}
            priority
            style={{ width: 'auto', height: `${logoSize}px` }}
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex" style={{ gap: '2.5rem', alignItems: 'center' }}>
          {content.links.map((link: any, i: number) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: navFontStack,
                fontWeight: i === 0 ? 700 : 500,
                fontSize: `${navFontSize}px`,
                color: 'var(--color-on-surface)',
                opacity: i === 0 ? 1 : 0.65,
                textDecoration: i === 0 ? 'underline' : 'none',
                textDecorationThickness: '2px',
                textUnderlineOffset: '4px',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => { (e.target as HTMLElement).style.opacity = '1'; }}
              onMouseOut={(e) => { if (i !== 0) (e.target as HTMLElement).style.opacity = '0.65'; }}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/dashboard"
            aria-label="Dashboard"
            style={{
              background: 'none', border: 'none',
              color: 'var(--color-primary)', padding: '0.2rem',
              lineHeight: 1, display: 'flex', alignItems: 'center'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem' }}
        >
          <svg width="26" height="18" viewBox="0 0 26 18" fill="none">
            <line x1="0" y1="2" x2="26" y2="2" stroke="#1a1c1c" strokeWidth="2" />
            <line x1="0" y1="9" x2="18" y2="9" stroke="#1a1c1c" strokeWidth="2" />
            <line x1="0" y1="16" x2="26" y2="16" stroke="#1a1c1c" strokeWidth="2" />
          </svg>
        </button>
      </nav>
    </>
  );
}

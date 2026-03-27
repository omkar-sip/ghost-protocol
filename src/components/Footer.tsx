'use client';

import { SectionProps } from '@/types/theme';

export default function Footer({ settings: content, id }: SectionProps) {
  return (
    <footer
      style={{
        background: 'var(--color-surface-container-low)',
        borderTop: '1px solid rgba(192,202,173,0.2)',
        padding: '3.5rem 2rem',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '2rem'
      }}
    >
      {/* Divider doodle */}
      <svg width="200" height="16" viewBox="0 0 200 16" aria-hidden="true" style={{ opacity: 0.2 }}>
        <path d="M0 8 C40 3, 80 13, 120 7 C160 1, 180 12, 200 8" stroke="#1a1c1c" strokeWidth="1.5" fill="none" />
      </svg>

      <div
        style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '1.5rem',
          width: '100%', maxWidth: '800px'
        }}
      >
        <div
          style={{
            fontFamily: "'Epilogue', sans-serif", fontWeight: 900,
            fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em'
          }}
        >
          {content.brand}
        </div>

        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {content.socialLinks.map((link: any) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: "'Space Grotesk', monospace", fontSize: '10px',
                textTransform: 'uppercase', letterSpacing: '0.14em',
                color: 'var(--color-on-surface)', opacity: 0.45,
                textDecoration: 'none', transition: 'opacity 0.2s, color 0.2s'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.opacity = '1';
                (e.target as HTMLElement).style.color = '#406900';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.opacity = '0.45';
                (e.target as HTMLElement).style.color = '#1a1c1c';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="stamp" style={{ fontSize: '9px' }}>
          {content.copyright}
        </div>
      </div>
    </footer>
  );
}

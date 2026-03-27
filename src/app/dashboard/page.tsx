'use client';

import Link from 'next/link';

const sections = [
  {
    name: 'Hero Section',
    href: '/dashboard/hero',
    icon: '◆',
    description: 'Edit badge, headline, description, CTAs, and hero image',
    color: '#a2ff00',
  },
  {
    name: 'Victory Lap (Wins)',
    href: '/dashboard/wins',
    icon: '★',
    description: 'Manage hackathon win cards — add, edit, or remove achievements',
    color: '#fbbf24',
  },
  {
    name: 'The Garage',
    href: '/dashboard/garage',
    icon: '▣',
    description: 'Manage gallery sketches — add, edit, or remove items',
    color: '#60a5fa',
  },
  {
    name: 'Join / Contact',
    href: '/dashboard/join',
    icon: '✉',
    description: 'Edit form header, intro text, and document stamp',
    color: '#f472b6',
  },
  {
    name: 'Footer',
    href: '/dashboard/footer',
    icon: '▬',
    description: 'Edit social links, brand text, and copyright',
    color: '#a78bfa',
  },
  {
    name: 'Navigation',
    href: '/dashboard/navigation',
    icon: '☰',
    description: 'Edit nav brand name and menu links',
    color: '#34d399',
  },
  {
    name: 'Ticker Tape',
    href: '/dashboard/ticker',
    icon: '↔',
    description: 'Edit the scrolling marquee items',
    color: '#fb923c',
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1
          style={{
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 900,
            fontSize: '2rem',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: '#fff',
            marginBottom: '0.5rem',
          }}
        >
          Content Dashboard
        </h1>
        <p
          style={{
            fontFamily: "'Space Grotesk', monospace",
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#666',
          }}
        >
          GHOST PROTOCOL / CMS / SECTION_MANAGER
        </p>
      </div>

      {/* Section cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {sections.map((section) => (
          <Link
            key={section.name}
            href={section.href}
            style={{
              display: 'block',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              padding: '1.5rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = section.color;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            {/* Accent line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: section.color,
                opacity: 0.6,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.3rem', color: section.color }}>{section.icon}</span>
              <span
                style={{
                  fontFamily: "'Epilogue', sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                }}
              >
                {section.name}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.8rem',
                color: '#777',
                lineHeight: 1.6,
              }}
            >
              {section.description}
            </p>
            <div
              style={{
                marginTop: '1rem',
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: section.color,
                opacity: 0.7,
              }}
            >
              Edit →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

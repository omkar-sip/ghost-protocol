'use client';

import { useEffect, useRef, useState } from 'react';
import { SectionProps } from '@/types/theme';
import { WinCard } from '@/types/content';

export default function WinsSection({ settings: content }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [openImage, setOpenImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    if (!reveals) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = (entry.target as HTMLElement).style.getPropertyValue('--delay') || '0s';
          (entry.target as HTMLElement).style.transitionDelay = delay;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenImage(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const tapeRotations = ['rotate(-2deg)', 'rotate(2deg)', 'rotate(-1deg)'];
  const fallbackWins: WinCard[] = [
    {
      id: '3',
      badge: 'Grand Prix / 2024',
      title: 'ANALOG_CLOUD',
      description: 'Best Design at SXSW Hack. A low-latency bridge between paper sketches and cloud infrastructure.',
      status: 'Status: Scaling to v2',
    },
    {
      id: '4',
      badge: 'Hackathon Project',
      title: 'NEBULON',
      description: 'Hackathon project from the Ghost Protocol team.',
      status: 'Status: Archived Win',
    },
    {
      id: '5',
      badge: '3rd Place',
      title: 'SMART HORIZON INTERNATIONAL HACKATHON',
      description: 'Awarded 3rd place at the Smart Horizon International Hackathon.',
      status: 'Status: Verified Placement',
    },
    {
      id: '6',
      badge: '2026 / Bhartesh College',
      title: 'HACKPULSE 2026',
      description: 'HackPulse 2026 hackathon held at Bhartesh College.',
      status: 'Status: Hackathon Win',
    },
    {
      id: '7',
      badge: 'CTF Competition',
      title: 'CTF COMPETITION',
      description: 'Capture the Flag competition at JCER.',
      status: 'Status: Competition Win',
    },
    {
      id: '8',
      badge: 'Hackathon',
      title: 'HACKEVA HACKATHON',
      description: 'HackEva Hackathon achievement.',
      status: 'Status: Hackathon Win',
    },
  ];
  const existingCards: WinCard[] = Array.isArray(content.cards) ? content.cards : [];
  const cards: WinCard[] = [
    ...existingCards,
    ...fallbackWins.filter((fallback) => !existingCards.some((card) => card.title === fallback.title)),
  ];

  return (
    <section
      ref={sectionRef}
      id="wins"
      style={{
        padding: '6rem 2rem',
        background: 'var(--color-surface-container-low)',
        position: 'relative', overflow: 'hidden'
      }}
    >
      <div
        className="ghost-wm"
        style={{ bottom: 0, left: '-2vw', lineHeight: 0.8, opacity: 0.025 }}
        aria-hidden="true"
      >
        WIN
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section header */}
        <div
          className="reveal"
          style={{
            display: 'flex', alignItems: 'baseline', gap: '1.2rem',
            marginBottom: '4.5rem', flexWrap: 'wrap'
          }}
        >
          <h2
            className="font-headline"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '-0.02em'
            }}
          >
            {content.title}
          </h2>
          <div
            style={{
              flex: 1, minWidth: '60px',
              borderBottom: '2px dashed var(--color-outline)',
              marginBottom: '0.3rem'
            }}
          />
          <span className="stamp">{content.stamp}</span>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '3.5rem'
          }}
        >
          {cards.map((card: WinCard, i: number) => (
            <div
              key={card.id ? `id-${card.id}` : `idx-${i}`}
              className="win-card reveal"
              style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}
            >
              <div
                className="tape"
                style={{
                  transform: `translateX(-50%) ${tapeRotations[i % tapeRotations.length]}`
                }}
              />
              {card.imageUrl && (
                <button
                  type="button"
                  aria-label={`Open image for ${card.title}`}
                  onClick={() => setOpenImage({ src: card.imageUrl as string, alt: `${card.title} win` })}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'zoom-in',
                    width: '100%',
                    display: 'block',
                    marginBottom: '1rem'
                  }}
                >
                  <img
                    src={card.imageUrl}
                    alt={`${card.title} win`}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 9',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '1px solid rgba(26,28,28,0.12)'
                    }}
                  />
                </button>
              )}
              <span
                style={{
                  fontFamily: "'Space Grotesk', monospace", fontWeight: 700,
                  fontSize: '10px', textTransform: 'uppercase',
                  letterSpacing: '0.12em', color: 'var(--color-primary)'
                }}
              >
                {card.badge}
              </span>
              <h3
                className="font-headline"
                style={{
                  fontSize: '1.5rem', fontWeight: 900,
                  margin: '1rem 0 0.6rem', textTransform: 'uppercase'
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem', color: 'var(--color-on-surface-variant)',
                  lineHeight: 1.7, marginBottom: '1.5rem'
                }}
              >
                {card.description}
              </p>
              <div
                style={{
                  height: '1px', background: 'rgba(26,28,28,0.1)',
                  marginBottom: '1rem'
                }}
              />
              <span className="stamp">{card.status}</span>
            </div>
          ))}
        </div>
      </div>

      {openImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded win image"
          onClick={() => setOpenImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 1000
          }}
        >
          <button
            type="button"
            onClick={() => setOpenImage(null)}
            aria-label="Close image"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              border: '1px solid rgba(255,255,255,0.5)',
              background: 'rgba(0,0,0,0.35)',
              color: '#fff',
              fontSize: '1.25rem',
              lineHeight: 1,
              borderRadius: '8px',
              width: '2.25rem',
              height: '2.25rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          <img
            src={openImage.src}
            alt={openImage.alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 'min(1100px, 100%)',
              maxHeight: '85vh',
              width: 'auto',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
              objectFit: 'contain'
            }}
          />
        </div>
      )}
    </section>
  );
}

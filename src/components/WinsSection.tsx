'use client';

import { useEffect, useRef } from 'react';
import { SectionProps } from '@/types/theme';

export default function WinsSection({ settings: content, id }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

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

  const tapeRotations = ['rotate(-2deg)', 'rotate(2deg)', 'rotate(-1deg)'];

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
          {content.cards.map((card: any, i: number) => (
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
    </section>
  );
}

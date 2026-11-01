'use client';

import { useEffect, useRef } from 'react';
import { SectionProps } from '@/types/theme';

export default function HeroSection({ settings: content, id }: SectionProps) {
  const heroImgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const heroTitleAnimation = String(content.heroTitleAnimation ?? 'none');

  const getHeroTitleAnimationStyle = (animationKey: string): React.CSSProperties => {
    switch (animationKey) {
      case 'float':
      case 'Float Drift':
        return { animation: 'hero-title-float 6.5s ease-in-out infinite' };
      case 'glitch':
      case 'Glitch Pulse':
        return { animation: 'hero-title-glitch 2.6s steps(2, end) infinite' };
      case 'pulse':
      case 'Neon Pulse':
        return { animation: 'hero-title-pulse 3.6s ease-in-out infinite' };
      case 'wave':
      case 'Wave Tilt':
        return { animation: 'hero-title-wave 5.2s ease-in-out infinite' };
      default:
        return { animation: 'none' };
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (heroImgRef.current) {
        const offset = window.scrollY * 0.08;
        heroImgRef.current.style.transform = `translateY(${offset}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Reveal animation on load
    const timer = setTimeout(() => {
      sectionRef.current?.querySelectorAll('.reveal').forEach(el => {
        (el as HTMLElement).style.transitionDelay = '0.15s';
        el.classList.add('visible');
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        minHeight: '92vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '5rem 2rem 4rem',
        position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Ghost watermark */}
      <div
        className="ghost-wm"
        style={{ right: '-4vw', top: '50%', transform: 'translateY(-50%)' }}
        aria-hidden="true"
      >
        GP
      </div>

      {/* Doodle SVG accent */}
      <svg
        className="doodle-arrow"
        style={{ top: '20%', left: '45%', width: '120px' }}
        viewBox="0 0 120 60"
        aria-hidden="true"
      >
        <path d="M10 50 C 40 10, 80 10, 110 30" stroke="#406900" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
        <path d="M100 22 L110 30 L100 38" stroke="#406900" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>

      <div
        style={{
          maxWidth: '1280px', width: '100%', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem',
          alignItems: 'center'
        }}
        className="md:grid-cols-2 grid-cols-1"
      >
        <div style={{ position: 'relative', zIndex: 2 }} className="reveal">
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--color-primary-container)', color: '#102000',
              padding: '0.5rem 1.2rem', transform: 'rotate(-1.5deg)',
              fontFamily: "'Epilogue', sans-serif", fontWeight: 800,
              fontSize: '0.8rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', marginBottom: '1.8rem',
              animation: 'float 4s ease-in-out infinite'
            }}
          >
            {content.badge}
          </div>

          {/* Headline */}
          <h1
            className="font-headline hero-title-anim"
            style={{
              fontSize: 'clamp(4.5rem, 11vw, 9rem)', fontWeight: 900,
              color: 'var(--color-on-surface)', lineHeight: 0.85,
              letterSpacing: '-0.03em', textTransform: 'uppercase',
              position: 'relative', marginBottom: '2rem',
              ...getHeroTitleAnimationStyle(heroTitleAnimation)
            }}
            dangerouslySetInnerHTML={{ __html: content.title }}
          />

          {/* Body */}
          <p
            style={{
              fontSize: '1.05rem', maxWidth: '420px',
              color: 'var(--color-on-surface-variant)', lineHeight: 1.75,
              marginBottom: '2.5rem'
            }}
          >
            {content.description.split('digital blueprints that breathe').map((part: string, i: number, arr: string[]) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <span className="sketch-underline" style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>
                    digital blueprints that breathe
                  </span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={content.ctaLink} className="btn-primary">
              <span>{content.cta}</span>
            </a>
            <a href={content.secondaryCtaLink} className="btn-ghost">
              {content.secondaryCta}
            </a>
          </div>

          {/* Meta chip */}
          <div style={{ marginTop: '2.5rem' }}>
            <div className="chip">
              <span
                style={{
                  display: 'inline-block', width: '5px', height: '5px',
                  background: 'var(--color-primary-container)',
                  border: '1px solid var(--color-primary)',
                  marginRight: '6px', verticalAlign: 'middle',
                  animation: 'pulse-dot 2s infinite'
                }}
              />
              SYSTEM_STATUS : CANVAS_READY
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div ref={heroImgRef} className="hero-img-wrap reveal" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              position: 'relative', border: '3px solid var(--color-on-surface)',
              padding: '1rem', background: 'var(--color-surface)',
              transform: 'translateX(8px) translateY(-8px)',
              transition: 'transform 0.4s'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image}
              alt={content.imageAlt}
              style={{
                width: '100%', display: 'block',
                filter: 'grayscale(1) contrast(1.2) brightness(1.05)',
                mixBlendMode: 'multiply'
              }}
              loading="eager"
            />
            {/* Corner label */}
            <div className="coord-label" style={{ position: 'absolute', top: '0.7rem', right: '0.7rem' }}>
              Ref: GP_001
            </div>
            {/* SVG corner marks */}
            <svg
              style={{ position: 'absolute', top: '4px', left: '4px', width: '16px', height: '16px', opacity: 0.4 }}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M0 10 L0 0 L10 0" stroke="#1a1c1c" strokeWidth="1.5" fill="none" />
            </svg>
            <svg
              style={{ position: 'absolute', bottom: '4px', right: '4px', width: '16px', height: '16px', opacity: 0.4 }}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M16 6 L16 16 L6 16" stroke="#1a1c1c" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      {/* Vertical coord text */}
      <div
        className="coord-label"
        style={{
          position: 'absolute', right: '1.5rem', top: '50%',
          transform: 'rotate(90deg) translateX(-50%)',
          transformOrigin: 'right center'
        }}
        aria-hidden="true"
      >
        48.2132° N / 11.5769° E
      </div>
    </section>
  );
}

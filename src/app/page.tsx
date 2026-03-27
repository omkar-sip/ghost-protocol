'use client';

import { useEffect, useState } from 'react';
import { ThemeConfig } from '@/types/theme';
import { componentRegistry } from '@/registry';
import CustomCursor from '@/components/CustomCursor';
import ThemeProvider from '@/components/ThemeProvider';

export default function DynamicPage() {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);

  useEffect(() => {
    // Initial fetch from the dynamic API
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => setTheme(data))
      .catch(err => console.error("Failed to load theme:", err));

    // Listen for live updates from the Shopify-like dashboard iframe
    const handleMessage = (event: MessageEvent) => {
      // In production, we'd verify origin, but localhost is fine for dev
      if (event.data?.type === 'UPDATE_THEME') {
        console.log("Received live preview payload:", event.data.payload);
        setTheme(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!theme || !theme.sections) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0a0a0a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '7px', height: '7px', background: '#a2ff00',
            border: '1px solid #406900', animation: 'pulse-dot 2s infinite'
          }} />
          <span style={{
            fontFamily: "'Space Grotesk', monospace", fontSize: '10px',
            textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.5, color: '#fff'
          }}>
            INITIALIZING_CANVAS...
          </span>
        </div>
      </div>
    );
  }

  // Extract layout components to render them outside <main>, this keeps sticky navs happy
  const navSection = theme.sections.find(s => s.type === 'navbar');
  const tickerSection = theme.sections.find(s => s.type === 'ticker');
  const footerSections = theme.sections.filter(s => s.type === 'footer');
  
  // All other content sections
  const mainSections = theme.sections.filter(
    s => s.type !== 'navbar' && s.type !== 'ticker' && s.type !== 'footer'
  );

  const renderSection = (section: any) => {
    const Component = componentRegistry[section.type];
    if (!Component) {
      console.warn(`Component type "${section.type}" not found in registry.`);
      return null;
    }
    return <Component key={section.id} id={section.id} settings={section.settings} />;
  };

  return (
    <ThemeProvider global={theme.global}>
      <CustomCursor />

      {/* Status Badge */}
      <div className="status-badge">
        <div className="status-dot" />
        SYSTEM_STABLE : CANVAS_READY
      </div>

      {navSection && renderSection(navSection)}
      {tickerSection && renderSection(tickerSection)}

      <main>
        {mainSections.map(renderSection)}
      </main>

      {footerSections.map(renderSection)}
    </ThemeProvider>
  );
}

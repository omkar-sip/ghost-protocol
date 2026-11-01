'use client';

import { useEffect, useState } from 'react';
import { ThemeConfig } from '@/types/theme';
import { componentRegistry } from '@/registry';
import CustomCursor from '@/components/CustomCursor';
import ThemeProvider from '@/components/ThemeProvider';
import defaultTheme from '@/data/theme.json';

export default function DynamicPage() {
  // Render the checked-in theme immediately. Firestore is an optional source
  // of live edits and must not be able to keep the public page on a spinner.
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme as ThemeConfig);

  useEffect(() => {
    // Initial fetch from the dynamic API
    fetch('/api/theme')
      .then(async (res) => {
        if (!res.ok) throw new Error(`Theme API returned ${res.status}`);
        const data = await res.json();
        if (data && Array.isArray(data.sections)) setTheme(data as ThemeConfig);
      })
      .catch(err => console.warn("Using local theme fallback:", err));

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

      {navSection && renderSection(navSection)}
      {tickerSection && renderSection(tickerSection)}

      <main>
        {mainSections.map(renderSection)}
      </main>

      {footerSections.map(renderSection)}
    </ThemeProvider>
  );
}

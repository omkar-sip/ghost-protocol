'use client';

import { GlobalSettings } from '@/types/theme';

export default function ThemeProvider({ 
  global, 
  children 
}: { 
  global: GlobalSettings; 
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        :root {
          --color-primary-container: ${global?.colors?.primaryContainer || '#a2ff00'};
          --color-bg: ${global?.colors?.background || '#0a0a0a'};
        }
        
        /* Inject dynamic overrides directly for testing purposes. Real implementation would map these fully to Tailwind theme or globals.css */
        ::selection { background: var(--color-primary-container); color: #000; }
        .text-accent { color: var(--color-primary-container) !important; }
        .bg-accent { background-color: var(--color-primary-container) !important; }
        .border-accent { border-color: var(--color-primary-container) !important; }
      `}</style>
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        {children}
      </div>
    </>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { SiteContent } from '@/types/content';

export function useContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveContent = useCallback(async (updatedContent: SiteContent) => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });
      if (res.ok) {
        setContent(updatedContent);
        setToast('✓ Content saved successfully');
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast('✕ Failed to save content');
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast('✕ Failed to save content');
      setTimeout(() => setToast(null), 3000);
    }
    setSaving(false);
  }, []);

  return { content, setContent, loading, saving, saveContent, toast };
}

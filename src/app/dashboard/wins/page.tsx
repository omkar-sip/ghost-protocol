'use client';

import { useState } from 'react';
import { useContent } from '@/hooks/useContent';
import { WinCard } from '@/types/content';
import '../dashboard.css';

export default function WinsEditor() {
  const { content, saveContent, loading, saving, toast } = useContent();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loading || !content) return <div style={{ color: '#666' }}>Loading...</div>;

  const wins = content.wins;

  const updateTitle = (value: string) => {
    saveContent({ ...content, wins: { ...wins, title: value } });
  };

  const updateStamp = (value: string) => {
    saveContent({ ...content, wins: { ...wins, stamp: value } });
  };

  const updateCard = (id: string, field: keyof WinCard, value: string) => {
    const updatedCards = wins.cards.map(c => c.id === id ? { ...c, [field]: value } : c);
    saveContent({ ...content, wins: { ...wins, cards: updatedCards } });
  };

  const addCard = () => {
    const newId = Date.now().toString();
    const newCard: WinCard = {
      id: newId,
      badge: 'New / 2024',
      title: 'NEW_PROJECT',
      description: 'Describe your achievement here.',
      status: 'Status: In Progress',
    };
    saveContent({ ...content, wins: { ...wins, cards: [...wins.cards, newCard] } });
    setEditingId(newId);
  };

  const deleteCard = (id: string) => {
    const updatedCards = wins.cards.filter(c => c.id !== id);
    saveContent({ ...content, wins: { ...wins, cards: updatedCards } });
  };

  return (
    <div>
      <div className="dash-section-header">
        <h2>Victory Lap (Wins)</h2>
        <p>Manage your hackathon wins and achievements</p>
      </div>

      <div style={{ maxWidth: '700px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label className="dash-label">Section Title</label>
            <input className="dash-input" defaultValue={wins.title} onBlur={(e) => updateTitle(e.target.value)} />
          </div>
          <div>
            <label className="dash-label">Archive Stamp</label>
            <input className="dash-input" defaultValue={wins.stamp} onBlur={(e) => updateStamp(e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="dash-label" style={{ marginBottom: '1rem' }}>Win Cards ({wins.cards.length})</label>
        </div>

        {wins.cards.map((card) => (
          <div key={card.id} className="dash-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span
                style={{
                  fontFamily: "'Epilogue', sans-serif", fontWeight: 700,
                  fontSize: '0.9rem', color: '#a2ff00', textTransform: 'uppercase'
                }}
              >
                {card.title}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="dash-btn-danger"
                  onClick={() => editingId === card.id ? setEditingId(null) : setEditingId(card.id)}
                  style={{ color: '#a2ff00', borderColor: '#a2ff00' }}
                >
                  {editingId === card.id ? 'Close' : 'Edit'}
                </button>
                <button className="dash-btn-danger" onClick={() => deleteCard(card.id)}>
                  Delete
                </button>
              </div>
            </div>

            {editingId === card.id && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="dash-label">Badge (e.g. &quot;Gold / 2023&quot;)</label>
                  <input className="dash-input" defaultValue={card.badge} onBlur={(e) => updateCard(card.id, 'badge', e.target.value)} />
                </div>
                <div>
                  <label className="dash-label">Title</label>
                  <input className="dash-input" defaultValue={card.title} onBlur={(e) => updateCard(card.id, 'title', e.target.value)} />
                </div>
                <div>
                  <label className="dash-label">Description</label>
                  <textarea className="dash-textarea" defaultValue={card.description} onBlur={(e) => updateCard(card.id, 'description', e.target.value)} />
                </div>
                <div>
                  <label className="dash-label">Status</label>
                  <input className="dash-input" defaultValue={card.status} onBlur={(e) => updateCard(card.id, 'status', e.target.value)} />
                </div>
              </div>
            )}
          </div>
        ))}

        <button className="dash-btn-add" onClick={addCard}>
          + Add New Win Card
        </button>
      </div>

      {toast && <div className="dash-toast">{toast}</div>}
      {saving && <div className="dash-toast">Saving...</div>}
    </div>
  );
}

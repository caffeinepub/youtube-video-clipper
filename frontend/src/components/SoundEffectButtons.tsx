import React from 'react';
import { useSoundEffect } from '../hooks/useSoundEffect';

const SOUND_EFFECTS = [
  { id: 'airhorn', label: '📯 Airhorn', tone: 'airhorn' as const },
  { id: 'bruh', label: '😐 Bruh', tone: 'bruh' as const },
  { id: 'mission-failed', label: '💀 Mission Failed', tone: 'mission-failed' as const },
  { id: 'victory', label: '🏆 Victory!', tone: 'victory' as const },
];

export default function SoundEffectButtons() {
  const { playSound } = useSoundEffect();

  return (
    <div className="grid grid-cols-2 gap-2">
      {SOUND_EFFECTS.map((effect) => (
        <button
          key={effect.id}
          onClick={() => playSound(effect.tone)}
          className="text-xs px-3 py-2 rounded-lg cyberpunk-btn transition-smooth hover:neon-glow-sm text-left"
        >
          {effect.label}
        </button>
      ))}
    </div>
  );
}

import React from 'react';
import { Timer } from 'lucide-react';

interface SlowMoToggleProps {
  active: boolean;
  onToggle: () => void;
}

export default function SlowMoToggle({ active, onToggle }: SlowMoToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg border transition-smooth font-semibold ${
        active
          ? 'bg-cyan-neon/20 border-cyan-neon text-cyan-neon neon-glow-sm'
          : 'bg-purple-deep/50 border-cyan-neon/20 text-muted-foreground hover:border-cyan-neon/40 hover:text-foreground'
      }`}
    >
      <Timer className="w-3 h-3" />
      Slow-Mo
    </button>
  );
}

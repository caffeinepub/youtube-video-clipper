import React from 'react';
import { Captions } from 'lucide-react';

interface BurnInCaptionsToggleProps {
  active: boolean;
  onToggle: () => void;
}

export default function BurnInCaptionsToggle({ active, onToggle }: BurnInCaptionsToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg border transition-smooth font-semibold ${
        active
          ? 'bg-cyan-neon/20 border-cyan-neon text-cyan-neon neon-glow-sm'
          : 'bg-purple-deep/50 border-cyan-neon/20 text-muted-foreground hover:border-cyan-neon/40 hover:text-foreground'
      }`}
    >
      <Captions className="w-3 h-3" />
      Captions
    </button>
  );
}

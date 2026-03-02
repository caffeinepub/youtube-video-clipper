import React from 'react';
import { Sparkles } from 'lucide-react';

interface TikTokifyPresetButtonProps {
  active: boolean;
  onToggle: () => void;
}

export default function TikTokifyPresetButton({ active, onToggle }: TikTokifyPresetButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg border transition-smooth font-semibold ${
        active
          ? 'bg-pink-500/20 border-pink-400 text-pink-400'
          : 'bg-purple-deep/50 border-pink-500/20 text-muted-foreground hover:border-pink-400/40 hover:text-foreground'
      }`}
    >
      <Sparkles className="w-3 h-3" />
      TikTokify
    </button>
  );
}

import React from 'react';
import { Zap, TrendingUp, Minus } from 'lucide-react';

interface ViralScoreBadgeProps {
  score: number;
}

export default function ViralScoreBadge({ score }: ViralScoreBadgeProps) {
  const numScore = typeof score === 'number' ? score : Number(score) || 0;

  if (numScore >= 80) {
    return (
      <span className="flex items-center gap-1 text-xs font-orbitron px-2 py-0.5 rounded-full bg-cyan-neon/20 border border-cyan-neon/50 text-cyan-neon neon-glow-sm">
        <Zap className="w-3 h-3" />
        {numScore.toFixed(0)}
      </span>
    );
  }

  if (numScore >= 50) {
    return (
      <span className="flex items-center gap-1 text-xs font-orbitron px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400">
        <TrendingUp className="w-3 h-3" />
        {numScore.toFixed(0)}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs font-orbitron px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
      <Minus className="w-3 h-3" />
      {numScore.toFixed(0)}
    </span>
  );
}

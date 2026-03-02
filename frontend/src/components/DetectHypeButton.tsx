import React, { useState } from 'react';
import { Flame, Loader2 } from 'lucide-react';

interface DetectHypeButtonProps {
  duration: number;
  onHypeDetected: (timestamps: number[]) => void;
}

export default function DetectHypeButton({ duration, onHypeDetected }: DetectHypeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    if (!duration) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500));

    // Simulate detecting 3-5 hype peaks across the video
    const count = 3 + Math.floor(Math.random() * 3);
    const peaks: number[] = [];
    for (let i = 0; i < count; i++) {
      const t = Math.floor((duration / (count + 1)) * (i + 1) + (Math.random() - 0.5) * 20);
      peaks.push(Math.max(0, Math.min(duration, t)));
    }
    peaks.sort((a, b) => a - b);
    onHypeDetected(peaks);
    setLoading(false);
  };

  return (
    <button
      onClick={handleDetect}
      disabled={loading || !duration}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-orange-900/30 hover:bg-orange-900/50 border border-orange-500/40 text-orange-400 transition-smooth disabled:opacity-50 font-semibold"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Flame className="w-3 h-3" />
      )}
      {loading ? 'Detecting...' : 'Detect Hype'}
    </button>
  );
}

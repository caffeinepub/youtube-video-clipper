import React, { useState } from 'react';
import { Clock, Zap, Loader2 } from 'lucide-react';

interface OneTouchPresetsProps {
  duration: number;
  currentTime: number;
  onPreset: (startTime: number, endTime: number) => void;
}

export default function OneTouchPresets({ duration, currentTime, onPreset }: OneTouchPresetsProps) {
  const [autoHighlightLoading, setAutoHighlightLoading] = useState(false);

  const handleLast30 = () => {
    const end = Math.floor(currentTime > 0 ? currentTime : duration);
    const start = Math.max(0, end - 30);
    onPreset(start, end);
  };

  const handleLast60 = () => {
    const end = Math.floor(currentTime > 0 ? currentTime : duration);
    const start = Math.max(0, end - 60);
    onPreset(start, end);
  };

  const handleAutoHighlight = async () => {
    setAutoHighlightLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    // Simulate finding a peak around 40% of the video
    const peakTime = Math.floor(duration * 0.4);
    const start = Math.max(0, peakTime - 15);
    const end = Math.min(duration, peakTime + 15);
    onPreset(start, end);
    setAutoHighlightLoading(false);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground font-orbitron">PRESETS:</span>
      <button
        onClick={handleLast30}
        className="flex items-center gap-1 text-xs cyberpunk-btn px-2 py-1 rounded-lg transition-smooth"
      >
        <Clock className="w-3 h-3" />
        Last 30s
      </button>
      <button
        onClick={handleLast60}
        className="flex items-center gap-1 text-xs cyberpunk-btn px-2 py-1 rounded-lg transition-smooth"
      >
        <Clock className="w-3 h-3" />
        Last 60s
      </button>
      <button
        onClick={handleAutoHighlight}
        disabled={autoHighlightLoading || !duration}
        className="flex items-center gap-1 text-xs cyberpunk-btn px-2 py-1 rounded-lg transition-smooth disabled:opacity-50"
      >
        {autoHighlightLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Zap className="w-3 h-3" />
        )}
        {autoHighlightLoading ? 'Analyzing...' : 'Auto-Highlight'}
      </button>
    </div>
  );
}

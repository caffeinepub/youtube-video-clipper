import React, { useRef, useState, useCallback } from 'react';

interface HypeMarker {
  timestamp: number;
  label?: string;
}

interface TimelineScrubberProps {
  duration: number;
  currentTime: number;
  videoId?: string;
  hypeMarkers?: HypeMarker[];
  onSeek: (time: number) => void;
}

function formatTimeMs(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export default function TimelineScrubber({ duration, currentTime, videoId, hypeMarkers = [], onSeek }: TimelineScrubberProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);

  const getTimeFromEvent = useCallback((e: React.MouseEvent) => {
    if (!barRef.current || !duration) return 0;
    const rect = barRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    return (x / rect.width) * duration;
  }, [duration]);

  const handleClick = (e: React.MouseEvent) => {
    const time = getTimeFromEvent(e);
    onSeek(time);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const time = getTimeFromEvent(e);
    setHoverTime(time);
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      setHoverX(e.clientX - rect.left);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="glass-card rounded-xl p-3 border border-cyan-neon/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-cyan-neon">{formatTimeMs(currentTime)}</span>
        <span className="text-xs font-mono text-muted-foreground">{formatTimeMs(duration)}</span>
      </div>

      {/* Seek Bar */}
      <div
        ref={barRef}
        className="relative h-6 cursor-pointer group"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
      >
        {/* Track */}
        <div className="absolute inset-y-2 left-0 right-0 rounded-full bg-white/10">
          {/* Progress */}
          <div
            className="h-full rounded-full bg-cyan-neon transition-all duration-100"
            style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(0,242,255,0.6)' }}
          />
        </div>

        {/* Hype Markers */}
        {hypeMarkers.map((marker, i) => {
          const pct = duration > 0 ? (marker.timestamp / duration) * 100 : 0;
          return (
            <div
              key={i}
              className="absolute inset-y-0 w-1 rounded-full bg-yellow-400 animate-hype-marker cursor-pointer z-10"
              style={{ left: `${pct}%`, transform: 'translateX(-50%)', boxShadow: '0 0 6px rgba(250,204,21,0.8)' }}
              onClick={(e) => {
                e.stopPropagation();
                onSeek(marker.timestamp);
              }}
              title={`Hype @ ${formatTimeMs(marker.timestamp)}`}
            />
          );
        })}

        {/* Playhead - use inline style for vertical centering to avoid conflicting Tailwind classes */}
        <div
          className="absolute w-3 h-3 rounded-full bg-cyan-neon border-2 border-white z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${progress}%`, top: '50%', boxShadow: '0 0 8px rgba(0,242,255,0.8)' }}
        />

        {/* Hover Tooltip */}
        {hoverTime !== null && (
          <div
            className="absolute bottom-8 glass-card rounded-lg px-2 py-1 text-xs font-mono text-cyan-neon border border-cyan-neon/30 pointer-events-none z-30 -translate-x-1/2"
            style={{ left: hoverX }}
          >
            {videoId && (
              <img
                src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                alt="preview"
                className="w-20 h-12 object-cover rounded mb-1"
              />
            )}
            {formatTimeMs(hoverTime)}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { FileText, Zap } from 'lucide-react';
import { TranscriptSegment } from '../hooks/useTranscriptGenerator';

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  isLoading?: boolean;
  onSegmentSelect?: (startTime: number, endTime: number) => void;
  currentTime?: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TranscriptPanel({ segments, isLoading, onSegmentSelect, currentTime = 0 }: TranscriptPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (seg: TranscriptSegment) => {
    setSelectedIndex(seg.index);
    onSegmentSelect?.(seg.startTime, seg.endTime);
  };

  const activeIndex = segments.findIndex(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  );

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-cyan-neon/20">
      <div className="p-3 border-b border-cyan-neon/20 flex items-center gap-2">
        <FileText className="w-4 h-4 text-cyan-neon" />
        <h3 className="font-orbitron text-xs text-cyan-neon">TRANSCRIPT</h3>
        <span className="text-xs text-muted-foreground ml-auto">{segments.length} segments</span>
      </div>

      <div className="max-h-64 overflow-y-auto scrollbar-cyber">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-cyan-neon/5 animate-pulse" />
            ))}
          </div>
        ) : segments.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>Load a video to generate transcript</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {segments.map((seg) => {
              const isSelected = selectedIndex === seg.index;
              const isActive = activeIndex === seg.index;
              return (
                <button
                  key={seg.index}
                  onClick={() => handleSelect(seg)}
                  className={`w-full text-left p-2 rounded-lg transition-smooth border ${
                    isSelected
                      ? 'bg-cyan-neon/20 border-cyan-neon/60 neon-glow-sm'
                      : isActive
                      ? 'bg-cyan-neon/10 border-cyan-neon/30'
                      : 'border-transparent hover:bg-cyan-neon/5 hover:border-cyan-neon/20'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-cyan-neon/60 font-mono shrink-0 mt-0.5">
                      {formatTime(seg.startTime)}
                    </span>
                    <span className="text-xs text-foreground flex-1">{seg.text}</span>
                    {seg.isSmartClip && (
                      <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 text-cyan-neon shrink-0">
                        <Zap className="w-2.5 h-2.5" />
                        Smart
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Zap, Target } from 'lucide-react';
import { TranscriptSegment } from '../hooks/useTranscriptGenerator';

interface SmartClipsPanelProps {
  segments: TranscriptSegment[];
  onSelect: (startTime: number, endTime: number) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SmartClipsPanel({ segments, onSelect }: SmartClipsPanelProps) {
  const smartClips = segments.filter((s) => s.isSmartClip);

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-cyan-neon/20">
      <div className="p-3 border-b border-cyan-neon/20 flex items-center gap-2">
        <Target className="w-4 h-4 text-cyan-neon" />
        <h3 className="font-orbitron text-xs text-cyan-neon">SMART CLIPS</h3>
        <span className="text-xs text-muted-foreground ml-auto">{smartClips.length} detected</span>
      </div>

      <div className="max-h-48 overflow-y-auto scrollbar-cyber">
        {smartClips.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-xs">
            <Zap className="w-6 h-6 mx-auto mb-1 opacity-30" />
            <p>No gaming moments detected yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {smartClips.map((seg) => (
              <button
                key={seg.index}
                onClick={() => onSelect(Math.max(0, seg.startTime - 5), seg.endTime + 5)}
                className="w-full text-left p-2 rounded-lg border border-cyan-neon/20 hover:border-cyan-neon/50 hover:bg-cyan-neon/10 transition-smooth"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cyan-neon font-mono">{formatTime(seg.startTime)}</span>
                  <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 text-cyan-neon">
                    <Zap className="w-2.5 h-2.5" />
                    {seg.smartClipKeyword}
                  </span>
                  <span className="text-xs text-muted-foreground truncate flex-1">{seg.text}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

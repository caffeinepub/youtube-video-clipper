import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Music, Layers } from 'lucide-react';
import SoundEffectButtons from './SoundEffectButtons';
import GreenScreenOverlayButtons from './GreenScreenOverlayButtons';

interface MemeOverlayPanelProps {
  activeOverlay: string | null;
  onOverlayChange: (overlay: string | null) => void;
}

export default function MemeOverlayPanel({ activeOverlay, onOverlayChange }: MemeOverlayPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card rounded-2xl border border-cyan-neon/20 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 hover:bg-cyan-neon/5 transition-smooth"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-neon" />
          <span className="font-orbitron text-xs text-cyan-neon">MEME OVERLAYS</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-cyan-neon/20 p-3 space-y-4 animate-fade-in-up">
          {/* Sound Effects */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-3 h-3 text-cyan-neon" />
              <span className="text-xs font-orbitron text-cyan-neon/80">SOUND EFFECTS</span>
            </div>
            <SoundEffectButtons />
          </div>

          {/* Visual Overlays */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-3 h-3 text-cyan-neon" />
              <span className="text-xs font-orbitron text-cyan-neon/80">VISUAL OVERLAYS</span>
            </div>
            <GreenScreenOverlayButtons activeOverlay={activeOverlay} onOverlayChange={onOverlayChange} />
          </div>
        </div>
      )}
    </div>
  );
}

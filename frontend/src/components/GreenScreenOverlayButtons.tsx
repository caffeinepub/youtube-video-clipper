import React from 'react';

const OVERLAYS = [
  { id: 'green', label: '🟢 Green', color: 'rgba(0, 255, 0, 0.3)' },
  { id: 'red', label: '🔴 Red', color: 'rgba(255, 0, 0, 0.3)' },
  { id: 'blue', label: '🔵 Blue', color: 'rgba(0, 100, 255, 0.3)' },
  { id: 'gold', label: '🟡 Gold', color: 'rgba(255, 200, 0, 0.3)' },
];

interface GreenScreenOverlayButtonsProps {
  activeOverlay: string | null;
  onOverlayChange: (overlay: string | null) => void;
}

export default function GreenScreenOverlayButtons({ activeOverlay, onOverlayChange }: GreenScreenOverlayButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {OVERLAYS.map((overlay) => (
        <button
          key={overlay.id}
          onClick={() => onOverlayChange(activeOverlay === overlay.id ? null : overlay.id)}
          className={`text-xs px-3 py-2 rounded-lg border transition-smooth ${
            activeOverlay === overlay.id
              ? 'border-cyan-neon/60 bg-cyan-neon/10 text-cyan-neon'
              : 'border-cyan-neon/20 bg-purple-deep/30 text-muted-foreground hover:border-cyan-neon/40'
          }`}
        >
          {overlay.label}
        </button>
      ))}
    </div>
  );
}

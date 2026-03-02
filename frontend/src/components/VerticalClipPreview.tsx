import React from 'react';
import type { VideoClip } from '../types/app';

interface VerticalClipPreviewProps {
  clip: VideoClip;
}

export default function VerticalClipPreview({ clip }: VerticalClipPreviewProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-cyan-neon/20" style={{ aspectRatio: '9/16', maxWidth: '200px' }}>
      {clip.thumbnailUrl ? (
        <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-purple-deep">
          <p className="text-xs text-muted-foreground text-center px-2">{clip.title}</p>
        </div>
      )}
    </div>
  );
}

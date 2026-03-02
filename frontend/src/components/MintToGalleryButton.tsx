import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useMintClip } from '../hooks/useMintClip';
import { isMinted } from '../hooks/useMintedCollectibles';

interface MintToGalleryButtonProps {
  clip: {
    id: string;
    videoId?: string;
    title: string;
    thumbnailUrl?: string;
    startTime: number;
    endTime: number;
    score: number;
  };
  compact?: boolean;
}

export default function MintToGalleryButton({ clip, compact = false }: MintToGalleryButtonProps) {
  const { mintClip, minting } = useMintClip();
  const alreadyMinted = isMinted(clip.id);
  const isLoading = minting === clip.id;

  if (alreadyMinted) {
    return (
      <span className="flex items-center gap-1 text-xs font-orbitron px-2 py-1 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon">
        <Sparkles className="w-3 h-3" />
        {!compact && 'MINTED ✓'}
        {compact && '✓'}
      </span>
    );
  }

  return (
    <button
      onClick={() => mintClip(clip)}
      disabled={isLoading}
      className="flex items-center gap-1 text-xs font-orbitron px-2 py-1 rounded-full cyberpunk-btn transition-smooth disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      {!compact && (isLoading ? 'MINTING...' : 'MINT')}
    </button>
  );
}

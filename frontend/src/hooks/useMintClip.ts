import { useState } from 'react';
import { toast } from 'sonner';
import { addMintedCollectible, isMinted, MintedCollectible } from './useMintedCollectibles';
import { addNotification } from './useNotifications';

export function useMintClip() {
  const [minting, setMinting] = useState<string | null>(null);

  const mintClip = async (clip: {
    id: string;
    videoId?: string;
    title: string;
    thumbnailUrl?: string;
    startTime: number;
    endTime: number;
    score: number;
  }) => {
    if (isMinted(clip.id)) {
      toast.info('Already minted!');
      return;
    }

    setMinting(clip.id);
    try {
      // Simulate minting delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const collectible: MintedCollectible = {
        clipId: clip.id,
        videoId: clip.videoId || '',
        title: clip.title,
        thumbnailUrl: clip.thumbnailUrl || '',
        startTime: clip.startTime,
        endTime: clip.endTime,
        viralScore: clip.score,
        mintedAt: Date.now(),
      };

      addMintedCollectible(collectible);
      addNotification(`🎖️ "${clip.title}" has been minted to your gallery!`, 'mint');
      toast.success('Clip minted to gallery! ✨', {
        description: 'Your clip is now a permanent digital collectible on ICP.',
      });
    } catch {
      toast.error('Minting failed. Please try again.');
    } finally {
      setMinting(null);
    }
  };

  return { mintClip, minting };
}

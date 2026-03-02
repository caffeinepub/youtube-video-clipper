import { useState } from 'react';
import { useInternetIdentity } from './useInternetIdentity';

export interface MintedCollectible {
  clipId: string;
  videoId: string;
  title: string;
  thumbnailUrl: string;
  startTime: number;
  endTime: number;
  viralScore: number;
  mintedAt: number;
}

// In-memory store for minted collectibles
let mintedStore: MintedCollectible[] = [];
let mintListeners: Array<() => void> = [];

export function addMintedCollectible(collectible: MintedCollectible) {
  mintedStore = [collectible, ...mintedStore];
  mintListeners.forEach((fn) => fn());
}

export function isMinted(clipId: string): boolean {
  return mintedStore.some((c) => c.clipId === clipId);
}

export function useMintedCollectibles() {
  const { identity } = useInternetIdentity();
  const [, forceUpdate] = useState(0);

  useState(() => {
    if (!identity) return;
    const fn = () => forceUpdate((n) => n + 1);
    mintListeners.push(fn);
    return () => {
      mintListeners = mintListeners.filter((l) => l !== fn);
    };
  });

  return {
    collectibles: identity ? mintedStore : [],
    isLoading: false,
  };
}

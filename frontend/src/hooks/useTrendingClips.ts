import { useQuery } from '@tanstack/react-query';
import { getClipsStore } from './useClips';
import type { VideoClip } from '../types/app';

export function useTrendingClips() {
  return useQuery<VideoClip[]>({
    queryKey: ['trendingClips'],
    queryFn: async () => {
      const clips = getClipsStore();
      return [...clips].sort((a, b) => b.score - a.score).slice(0, 10);
    },
    staleTime: 30000,
  });
}

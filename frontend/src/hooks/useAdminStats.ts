import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getClipsStore } from './useClips';
import type { TrendingClipAnalytics } from '../types/app';

export function useAdminStats() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const clips = getClipsStore();
      const totalClips = clips.length;

      const trendingAnalytics: TrendingClipAnalytics[] = clips
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((c) => ({
          id: c.id,
          title: c.title,
          scoreMetrics: c.score,
          trendingScore: c.score,
        }));

      const videoUploadStats = Array.from({ length: 12 }, (_, i) => ({
        hour: i * 2,
        count: Math.floor(Math.random() * 5),
      }));

      return { totalClips, trendingAnalytics, videoUploadStats };
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000,
  });
}

// Named exports for direct use
export function useTotalClips() {
  const { data } = useAdminStats();
  return data?.totalClips ?? 0;
}

export function useTrendingAnalytics() {
  const { data } = useAdminStats();
  return data?.trendingAnalytics ?? [];
}

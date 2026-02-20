import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TrendingClipAnalytics } from '../backend';

export function useAdminStats() {
  const { actor, isFetching } = useActor();

  const totalClipsQuery = useQuery<bigint>({
    queryKey: ['adminStats', 'totalClips'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      try {
        return await actor.getTotalClipsCount();
      } catch (error) {
        console.error('Error fetching total clips:', error);
        return BigInt(0);
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });

  const trendingAnalyticsQuery = useQuery<TrendingClipAnalytics[]>({
    queryKey: ['adminStats', 'trendingAnalytics'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getTrendingClipsAnalytics();
      } catch (error) {
        console.error('Error fetching trending analytics:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });

  return {
    totalClips: totalClipsQuery.data,
    trendingAnalytics: trendingAnalyticsQuery.data || [],
    isLoading: totalClipsQuery.isLoading || trendingAnalyticsQuery.isLoading,
    error: totalClipsQuery.error || trendingAnalyticsQuery.error,
  };
}

import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VideoClip } from '../backend';

export function useTrendingClips() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoClip[]>({
    queryKey: ['trendingClips'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingClips();
    },
    enabled: !!actor && !isFetching,
  });
}

import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Clip } from '../backend';

export function useTrendingClips() {
  const { actor, isFetching } = useActor();

  return useQuery<Clip[]>({
    queryKey: ['trendingClips'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getTrendingClips();
    },
    enabled: !!actor && !isFetching,
  });
}

import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { generateShortUserId } from '../utils/userIdGenerator';

export function useMyMessages() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const userId = identity ? generateShortUserId(identity.getPrincipal().toString()) : null;

  return useQuery({
    queryKey: ['myMessages', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      try {
        const result = await (actor as any).getMyMessages?.(userId);
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching && !!userId,
    refetchInterval: 30_000,
  });
}

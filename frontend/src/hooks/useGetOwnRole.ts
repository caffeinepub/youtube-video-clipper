import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useGetOwnRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string | null>({
    queryKey: ['ownRole', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await (actor as any).getCallerUserRole?.();
        if (result === undefined || result === null) return 'user';
        // Handle enum/string role
        if (typeof result === 'string') return result;
        if (typeof result === 'object' && '__kind__' in result) return result.__kind__;
        return String(result);
      } catch (err) {
        console.warn('useGetOwnRole error:', err);
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    staleTime: 60_000,
    retry: false,
  });
}

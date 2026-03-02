import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useIsOwner() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isOwner', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const result = await (actor as any).isCallerAdmin?.();
        return !!result;
      } catch {
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    staleTime: 60_000,
    retry: false,
  });
}

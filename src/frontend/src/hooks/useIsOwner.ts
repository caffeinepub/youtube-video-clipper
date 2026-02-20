import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useIsOwner() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isOwner', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return false;
      try {
        const principal = identity.getPrincipal();
        return await actor.isAdmin(principal);
      } catch (error) {
        console.error('Error checking owner status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    isOwner: query.data ?? false,
    isLoading: query.isLoading || query.isFetching,
    error: query.error,
  };
}

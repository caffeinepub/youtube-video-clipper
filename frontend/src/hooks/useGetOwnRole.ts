import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { UserRole } from '../backend';

export function useGetOwnRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserRole | null>({
    queryKey: ['ownRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        const role = await actor.getOwnRole();
        console.log('[useGetOwnRole] Fetched role:', role);
        return role;
      } catch (error) {
        console.error('[useGetOwnRole] Error fetching role:', error);
        // If the backend returns an error, return null instead of throwing
        // This handles the case where the user is authenticated but doesn't have a profile yet
        return null;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    // Don't throw errors, just return null
    throwOnError: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !!identity && query.isFetched,
  };
}

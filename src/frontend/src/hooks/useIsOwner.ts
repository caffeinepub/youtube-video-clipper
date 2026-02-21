import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useIsOwner() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isOwner'],
    queryFn: async () => {
      if (!actor) {
        console.log('[useIsOwner] No actor available');
        return false;
      }

      try {
        console.log('[useIsOwner] Calling isCallerAdmin()...');
        const result = await actor.isCallerAdmin();
        
        console.log('[useIsOwner] Raw response:', result);
        console.log('[useIsOwner] Response type:', typeof result);
        console.log('[useIsOwner] Response value:', result === true ? 'TRUE' : result === false ? 'FALSE' : 'OTHER');
        
        // Ensure we return a proper boolean
        const isAdmin = Boolean(result);
        console.log('[useIsOwner] Final boolean value:', isAdmin);
        
        return isAdmin;
      } catch (error) {
        console.error('[useIsOwner] Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });

  return {
    isOwner: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
    isFetched: query.isFetched,
    error: query.error,
  };
}

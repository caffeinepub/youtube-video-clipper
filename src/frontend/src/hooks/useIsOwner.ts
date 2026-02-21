import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useIsOwner() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  console.log('[useIsOwner] Hook invoked at', new Date().toISOString());
  console.log('[useIsOwner] Actor status:', {
    actorAvailable: !!actor,
    actorFetching,
    hasIdentity: !!identity,
    principalId: identity?.getPrincipal().toString() || 'none',
  });

  const query = useQuery<boolean>({
    queryKey: ['isOwner', identity?.getPrincipal().toString()],
    queryFn: async () => {
      console.log('[useIsOwner] queryFn executing at', new Date().toISOString());
      
      if (!actor) {
        console.error('[useIsOwner] ❌ No actor available - cannot call backend');
        throw new Error('Actor not available');
      }

      if (!identity) {
        console.log('[useIsOwner] ❌ No identity - user not authenticated');
        return false;
      }

      console.log('[useIsOwner] ✓ Actor and identity available, calling isCallerAdmin()...');
      console.log('[useIsOwner] Current principal:', identity.getPrincipal().toString());

      try {
        const startTime = Date.now();
        
        const result = await actor.isCallerAdmin();
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log('[useIsOwner] ✓ Backend call completed in', duration, 'ms');
        console.log('[useIsOwner] Raw backend response:', result);
        console.log('[useIsOwner] Response type:', typeof result);
        console.log('[useIsOwner] Is exactly true?', result === true);
        console.log('[useIsOwner] Is exactly false?', result === false);
        
        // Ensure we return a proper boolean
        const isAdmin = result === true;
        console.log('[useIsOwner] Final boolean value:', isAdmin);
        
        if (isAdmin) {
          console.log('[useIsOwner] ✅ USER IS ADMIN');
        } else {
          console.log('[useIsOwner] ❌ USER IS NOT ADMIN');
        }
        
        return isAdmin;
      } catch (error) {
        console.error('[useIsOwner] ❌ Error during backend call:', error);
        console.error('[useIsOwner] Error type:', error?.constructor?.name);
        console.error('[useIsOwner] Error message:', error instanceof Error ? error.message : String(error));
        
        // If the error is about unauthorized access, return false instead of throwing
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          console.log('[useIsOwner] Unauthorized error - returning false');
          return false;
        }
        
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    staleTime: 30000, // Cache for 30 seconds
    retry: false, // Don't retry on failure
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  console.log('[useIsOwner] Query state:', {
    status: query.status,
    data: query.data,
    dataType: typeof query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetched: query.isFetched,
    isError: query.isError,
    error: query.error ? String(query.error) : null,
  });

  const returnValue = {
    isOwner: query.data === true,
    isLoading: actorFetching || query.isLoading,
    isFetched: query.isFetched && !!actor,
    error: query.error,
    isError: query.isError,
    rawData: query.data,
    queryStatus: query.status,
    actorAvailable: !!actor,
  };

  console.log('[useIsOwner] Returning to component:', returnValue);

  return returnValue;
}

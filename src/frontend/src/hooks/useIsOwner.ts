import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useIsOwner() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isOwner', identity?.getPrincipal().toString()],
    queryFn: async () => {
      console.log('[useIsOwner] ========== isCallerAdmin CHECK START ==========');
      console.log('[useIsOwner] Timestamp:', new Date().toISOString());
      
      if (!actor || !identity) {
        console.log('[useIsOwner] ❌ Missing dependencies:', {
          hasActor: !!actor,
          hasIdentity: !!identity
        });
        console.log('[useIsOwner] Returning false due to missing dependencies');
        console.log('[useIsOwner] ========== isCallerAdmin CHECK END (MISSING DEPS) ==========');
        return false;
      }
      
      try {
        const principal = identity.getPrincipal().toString();
        console.log('[useIsOwner] ✅ All dependencies available');
        console.log('[useIsOwner] Authenticated user principal:', principal);
        console.log('[useIsOwner] Calling backend actor.isCallerAdmin()...');
        
        const startTime = Date.now();
        const result = await actor.isCallerAdmin();
        const endTime = Date.now();
        
        console.log('[useIsOwner] ========== BACKEND RESPONSE ==========');
        console.log('[useIsOwner] Backend call duration:', `${endTime - startTime}ms`);
        console.log('[useIsOwner] isCallerAdmin() returned:', result);
        console.log('[useIsOwner] Response type:', typeof result);
        console.log('[useIsOwner] Response is boolean:', typeof result === 'boolean');
        console.log('[useIsOwner] Response is truthy:', !!result);
        console.log('[useIsOwner] ========================================');
        
        if (result === true) {
          console.log('[useIsOwner] ✅ USER IS ADMIN - Access should be granted');
        } else {
          console.log('[useIsOwner] ❌ USER IS NOT ADMIN - Access will be denied');
          console.log('[useIsOwner] This could mean:');
          console.log('[useIsOwner]   1. Admin token was not provided in URL');
          console.log('[useIsOwner]   2. Admin token was incorrect');
          console.log('[useIsOwner]   3. Access control was not initialized properly');
          console.log('[useIsOwner]   4. Backend principal mismatch');
        }
        
        console.log('[useIsOwner] ========== isCallerAdmin CHECK END ==========');
        return result;
      } catch (error) {
        console.error('[useIsOwner] ========== ERROR CALLING isCallerAdmin ==========');
        console.error('[useIsOwner] Error object:', error);
        console.error('[useIsOwner] Error type:', typeof error);
        console.error('[useIsOwner] Error message:', error instanceof Error ? error.message : String(error));
        console.error('[useIsOwner] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('[useIsOwner] ========================================');
        console.log('[useIsOwner] Returning false due to error');
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity && !isInitializing,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Consider it loading if:
  // 1. Actor is still fetching
  // 2. Identity is still initializing
  // 3. We have an identity but the query hasn't fetched yet (not enabled or still loading)
  const isLoading = actorFetching || isInitializing || (!!identity && !query.isFetched);

  console.log('[useIsOwner] ========== HOOK STATE ==========');
  console.log('[useIsOwner] Timestamp:', new Date().toISOString());
  console.log('[useIsOwner] actorFetching:', actorFetching);
  console.log('[useIsOwner] isInitializing:', isInitializing);
  console.log('[useIsOwner] hasIdentity:', !!identity);
  console.log('[useIsOwner] hasActor:', !!actor);
  console.log('[useIsOwner] queryEnabled:', !!actor && !actorFetching && !!identity && !isInitializing);
  console.log('[useIsOwner] queryIsFetched:', query.isFetched);
  console.log('[useIsOwner] queryIsLoading:', query.isLoading);
  console.log('[useIsOwner] queryData:', query.data);
  console.log('[useIsOwner] queryError:', query.error);
  console.log('[useIsOwner] isLoading (computed):', isLoading);
  console.log('[useIsOwner] isOwner (final):', query.data ?? false);
  console.log('[useIsOwner] =====================================');

  return {
    isOwner: query.data ?? false,
    isLoading,
    error: query.error,
  };
}

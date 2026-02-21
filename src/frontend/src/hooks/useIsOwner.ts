import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useState, useEffect } from 'react';

export function useIsOwner() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Reset timeout when identity or actor changes
  useEffect(() => {
    setTimeoutReached(false);
  }, [identity, actor]);

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('[useIsOwner] ⏰ TIMEOUT: 10 seconds elapsed, forcing loading state to complete');
      setTimeoutReached(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [identity, actor, actorFetching, isInitializing]);

  const query = useQuery<{
    isOwner: boolean;
    debugInfo: {
      rawResponse: any;
      responseType: string;
      error: string | null;
      callDuration: number;
      timestamp: string;
    };
  }>({
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
        return {
          isOwner: false,
          debugInfo: {
            rawResponse: null,
            responseType: 'undefined',
            error: 'Missing actor or identity',
            callDuration: 0,
            timestamp: new Date().toISOString(),
          }
        };
      }
      
      try {
        const principal = identity.getPrincipal().toString();
        console.log('[useIsOwner] ✅ All dependencies available');
        console.log('[useIsOwner] Authenticated user principal:', principal);
        console.log('[useIsOwner] Calling backend actor.isCallerAdmin()...');
        
        const startTime = Date.now();
        const rawResult = await actor.isCallerAdmin();
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log('[useIsOwner] ========== BACKEND RESPONSE ==========');
        console.log('[useIsOwner] Backend call duration:', `${duration}ms`);
        console.log('[useIsOwner] RAW RESPONSE:', rawResult);
        console.log('[useIsOwner] RAW RESPONSE (JSON):', JSON.stringify(rawResult));
        console.log('[useIsOwner] Response type:', typeof rawResult);
        console.log('[useIsOwner] Response constructor:', rawResult?.constructor?.name);
        console.log('[useIsOwner] Response is boolean:', typeof rawResult === 'boolean');
        console.log('[useIsOwner] Response is truthy:', !!rawResult);
        console.log('[useIsOwner] Response === true:', rawResult === true);
        console.log('[useIsOwner] Response === false:', rawResult === false);
        console.log('[useIsOwner] Boolean(response):', Boolean(rawResult));
        console.log('[useIsOwner] ========================================');
        
        const booleanResult = Boolean(rawResult);
        
        if (booleanResult === true) {
          console.log('[useIsOwner] ✅ USER IS ADMIN - Access should be granted');
        } else {
          console.log('[useIsOwner] ❌ USER IS NOT ADMIN - Access will be denied');
          console.log('[useIsOwner] This could mean:');
          console.log('[useIsOwner]   1. Admin token was not provided in URL');
          console.log('[useIsOwner]   2. Admin token was incorrect');
          console.log('[useIsOwner]   3. Access control was not initialized properly');
          console.log('[useIsOwner]   4. Backend principal mismatch');
          console.log('[useIsOwner]   5. Backend isCallerAdmin() logic error');
        }
        
        console.log('[useIsOwner] ========== isCallerAdmin CHECK END ==========');
        
        return {
          isOwner: booleanResult,
          debugInfo: {
            rawResponse: rawResult,
            responseType: typeof rawResult,
            error: null,
            callDuration: duration,
            timestamp: new Date().toISOString(),
          }
        };
      } catch (error) {
        console.error('[useIsOwner] ========== ERROR CALLING isCallerAdmin ==========');
        console.error('[useIsOwner] Error object:', error);
        console.error('[useIsOwner] Error type:', typeof error);
        console.error('[useIsOwner] Error message:', error instanceof Error ? error.message : String(error));
        console.error('[useIsOwner] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        
        // Try to extract more details from the error
        if (error && typeof error === 'object') {
          console.error('[useIsOwner] Error keys:', Object.keys(error));
          console.error('[useIsOwner] Error JSON:', JSON.stringify(error, null, 2));
        }
        
        console.error('[useIsOwner] ========================================');
        console.log('[useIsOwner] Returning false due to error');
        
        return {
          isOwner: false,
          debugInfo: {
            rawResponse: null,
            responseType: 'error',
            error: error instanceof Error ? error.message : String(error),
            callDuration: 0,
            timestamp: new Date().toISOString(),
          }
        };
      }
    },
    enabled: !!actor && !actorFetching && !!identity && !isInitializing,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Improved loading state logic:
  // 1. If actor is fetching or identity is initializing, we're loading
  // 2. If we have an identity and actor, but query hasn't been enabled yet, we're loading
  // 3. If query is enabled and currently fetching/loading, we're loading
  // 4. If timeout is reached, stop loading regardless
  const queryEnabled = !!actor && !actorFetching && !!identity && !isInitializing;
  const isLoading = !timeoutReached && (
    actorFetching || 
    isInitializing || 
    (queryEnabled && (query.isLoading || query.isFetching))
  );

  console.log('[useIsOwner] ========== HOOK STATE ==========');
  console.log('[useIsOwner] Timestamp:', new Date().toISOString());
  console.log('[useIsOwner] actorFetching:', actorFetching);
  console.log('[useIsOwner] isInitializing:', isInitializing);
  console.log('[useIsOwner] hasIdentity:', !!identity);
  console.log('[useIsOwner] hasActor:', !!actor);
  console.log('[useIsOwner] queryEnabled:', queryEnabled);
  console.log('[useIsOwner] queryIsLoading:', query.isLoading);
  console.log('[useIsOwner] queryIsFetching:', query.isFetching);
  console.log('[useIsOwner] queryIsFetched:', query.isFetched);
  console.log('[useIsOwner] queryIsError:', query.isError);
  console.log('[useIsOwner] timeoutReached:', timeoutReached);
  console.log('[useIsOwner] COMPUTED isLoading:', isLoading);
  console.log('[useIsOwner] COMPUTED isOwner:', query.data?.isOwner ?? false);
  console.log('[useIsOwner] =====================================');

  return {
    isOwner: query.data?.isOwner ?? false,
    isLoading,
    isError: query.isError || timeoutReached,
    error: timeoutReached ? 'Permission check timed out after 10 seconds' : (query.error as Error)?.message,
    debugInfo: query.data?.debugInfo,
  };
}

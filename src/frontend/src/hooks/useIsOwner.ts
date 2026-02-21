import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useEffect } from 'react';

export function useIsOwner() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isOwner'],
    queryFn: async () => {
      const timestamp = new Date().toISOString();
      console.log(`[useIsOwner] ${timestamp} - Calling isCallerAdmin()`);
      
      if (!actor) {
        console.error('[useIsOwner] Actor not available');
        throw new Error('Actor not available');
      }
      
      try {
        const result = await actor.isCallerAdmin();
        console.log(`[useIsOwner] ${timestamp} - Backend response:`, result);
        return result;
      } catch (error) {
        console.error('[useIsOwner] Backend call failed:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 1,
    retryDelay: 500,
  });

  // Log state changes
  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.group(`[useIsOwner] State Update - ${timestamp}`);
    console.log('Actor:', {
      available: !!actor,
      fetching: actorFetching,
    });
    console.log('Identity:', {
      authenticated: !!identity,
      principalId: identity?.getPrincipal().toString() || 'none',
    });
    console.log('Query:', {
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isFetched: query.isFetched,
      data: query.data,
      error: query.error,
    });
    console.log('Computed:', {
      isLoading: actorFetching || query.isLoading,
      isFetched: !!actor && query.isFetched,
      isOwner: query.data ?? false,
    });
    console.groupEnd();
  }, [actor, actorFetching, identity, query.isLoading, query.isFetching, query.isFetched, query.data, query.error]);

  // Return custom state that properly reflects actor dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
    isOwner: query.data ?? false,
  };
}

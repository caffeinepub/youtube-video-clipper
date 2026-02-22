import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserRole } from '../backend';

export function useGetOwnRole() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserRole | null>({
    queryKey: ['ownRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getOwnRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

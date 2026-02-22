import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import { UserRole } from '../backend';

export function useUserRoles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, UserRole]>>({
    queryKey: ['userRoles'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllUserRoles();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

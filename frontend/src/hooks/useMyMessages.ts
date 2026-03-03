import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { AdminMessage } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';
import { generateShortUserId } from '../utils/userIdGenerator';

export function useMyMessages() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const principalStr = identity?.getPrincipal().toString() ?? '';
  const myUserId = principalStr ? generateShortUserId(principalStr) : '';

  return useQuery<AdminMessage[]>({
    queryKey: ['myMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyMessages(myUserId);
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 30_000,
  });
}

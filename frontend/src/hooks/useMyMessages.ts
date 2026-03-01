import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { AdminMessage } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

export function useMyMessages() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<AdminMessage[]>({
    queryKey: ['myMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyMessages();
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 30_000,
  });
}

import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useAdminList() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['adminList'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminsAsAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

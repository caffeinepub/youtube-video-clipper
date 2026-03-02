import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserRole } from '../backend';

export function useGetOwnRole() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['ownRole'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const role = await actor.getCallerUserRole();
        return role as string;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

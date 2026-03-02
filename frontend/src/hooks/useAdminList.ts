import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useAdminList() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['adminList'],
    queryFn: async () => {
      // Backend doesn't have getAdminsAsAdmin - return empty
      return [];
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000,
  });
}

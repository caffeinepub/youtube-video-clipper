import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../types/app';

export interface UserWithRole {
  principal: string;
  role: string;
  status: string;
  profile: UserProfile | null;
}

export function useUserRoles() {
  const { actor, isFetching } = useActor();

  return useQuery<UserWithRole[]>({
    queryKey: ['userRoles'],
    queryFn: async () => {
      // Backend doesn't have getAllUserRoles - return empty
      return [];
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

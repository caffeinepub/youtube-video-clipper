import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import { UserRole, UserProfile, UserStatus } from '../backend';

export type UserRoleWithStatus = {
  principal: Principal;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile | null;
};

export function useUserRoles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRoleWithStatus[]>({
    queryKey: ['allUserRoles'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Get all user roles
      const userRoles = await actor.getAllUserRoles();
      
      // Fetch profiles for each user to get their status
      const usersWithStatus = await Promise.all(
        userRoles.map(async ([principal, role]) => {
          try {
            const profile = await actor.getUserProfile(principal);
            return {
              principal,
              role,
              status: profile?.status || UserStatus.active,
              profile,
            };
          } catch (error) {
            console.error(`Failed to fetch profile for ${principal.toString()}:`, error);
            return {
              principal,
              role,
              status: UserStatus.active,
              profile: null,
            };
          }
        })
      );
      
      return usersWithStatus;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

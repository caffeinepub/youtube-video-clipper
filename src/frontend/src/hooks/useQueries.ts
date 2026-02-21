import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      const timestamp = new Date().toISOString();
      console.log(`[useGetCallerUserProfile] ${timestamp} - Fetching user profile`);
      
      if (!actor) throw new Error('Actor not available');
      
      const profile = await actor.getCallerUserProfile();
      console.log('[useGetCallerUserProfile] Profile fetched:', profile);
      
      if (profile && profile.name) {
        const parts = profile.name.split('|');
        if (parts.length === 2) {
          console.log('[useGetCallerUserProfile] Extracted from profile:', {
            name: parts[0],
            email: parts[1],
          });
        }
      }
      
      return profile;
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

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      const timestamp = new Date().toISOString();
      console.log(`[useSaveCallerUserProfile] ${timestamp} - Saving profile:`, profile);
      
      if (!actor) throw new Error('Actor not available');
      
      await actor.saveCallerUserProfile(profile);
      console.log('[useSaveCallerUserProfile] Profile saved successfully');
    },
    onSuccess: () => {
      console.log('[useSaveCallerUserProfile] Invalidating queries after profile save');
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['isOwner'] });
    },
  });
}

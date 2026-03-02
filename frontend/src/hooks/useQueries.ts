import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../types/app';

// In-memory profile store since backend doesn't have profile methods
const profileStore = new Map<string, UserProfile>();

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend only has getCallerUserRole, so we build a minimal profile from that
      try {
        const role = await actor.getCallerUserRole();
        const stored = profileStore.get('current');
        if (stored) return stored;
        return null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      profileStore.set('current', profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useStoreGoogleOAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ authorizationCode, redirectUri }: { authorizationCode: string; redirectUri: string }) => {
      // Not available in backend - stub
      console.log('OAuth store not available in backend', authorizationCode, redirectUri);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtubeChannel'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

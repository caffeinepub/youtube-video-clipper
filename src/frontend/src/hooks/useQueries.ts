import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const profile = await actor.getCallerUserProfile();
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
      if (!actor) throw new Error('Actor not available');
      
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['isOwner'] });
    },
  });
}

export function useHasGoogleOAuth() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasGoogleOAuth'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.hasGoogleOAuthCredentials();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsYouTubeConnected() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isYouTubeConnected'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isYouTubeChannelConnected();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useStoreGoogleOAuth() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ authorizationCode, redirectUri }: { authorizationCode: string; redirectUri: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      await actor.storeGoogleOAuthCredentials(authorizationCode, redirectUri);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['hasGoogleOAuth'] });
      queryClient.invalidateQueries({ queryKey: ['isYouTubeConnected'] });
      queryClient.invalidateQueries({ queryKey: ['youtubeChannel'] });
    },
  });
}

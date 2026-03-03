import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, GoogleOAuthCredentials } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
    refetchOnMount: 'always',
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
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useStoreGoogleOAuth() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      authorizationCode,
      redirectUri,
    }: {
      authorizationCode: string;
      redirectUri: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.storeGoogleOAuthCredentials(authorizationCode, redirectUri);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['youtubeChannel'] });
      await queryClient.invalidateQueries({ queryKey: ['googleOAuth'] });
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      await queryClient.refetchQueries({ queryKey: ['youtubeChannel'] });
      await queryClient.refetchQueries({ queryKey: ['googleOAuth'] });
    },
  });
}

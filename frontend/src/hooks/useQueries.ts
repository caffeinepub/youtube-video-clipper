import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export interface UserProfile {
  name: string;
  role: string;
  status: string;
  youtubeAuth?: any;
  googleOAuthCredentials?: any;
  profilePicture?: any;
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await (actor as any).getCallerUserProfile?.();
      if (result === undefined || result === null) return null;
      // Handle Option type from backend
      if (typeof result === 'object' && '__kind__' in result) {
        if (result.__kind__ === 'None') return null;
        if (result.__kind__ === 'Some') return result.value as UserProfile;
      }
      return result as UserProfile;
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
      await (actor as any).saveCallerUserProfile?.(profile);
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
    mutationFn: async (params: { code: string; redirectUri: string }) => {
      if (!actor) throw new Error('Actor not available');
      return await (actor as any).storeGoogleOAuthCredentials?.(params.code, params.redirectUri);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtubeChannel'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.refetchQueries({ queryKey: ['youtubeChannel'] });
    },
  });
}

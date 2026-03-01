import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface YouTubeChannelStatus {
  isConnected: boolean;
  channelName?: string;
  channelId?: string;
}

export function useYouTubeChannel() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const channelQuery = useQuery<YouTubeChannelStatus>({
    queryKey: ['youtubeChannel'],
    queryFn: async () => {
      if (!actor) return { isConnected: false };
      try {
        // Check both OAuth credentials and YouTube channel connection
        const [hasOAuth, isYTConnected] = await Promise.all([
          actor.hasGoogleOAuthCredentials(),
          actor.isYouTubeChannelConnected(),
        ]);

        const isConnected = hasOAuth || isYTConnected;

        if (isConnected) {
          // Try to get channel details from profile
          try {
            const profile = await actor.getCallerUserProfile();
            if (profile && profile.youtubeAuth) {
              return {
                isConnected: true,
                channelName: profile.youtubeAuth.channelName,
                channelId: profile.youtubeAuth.channelId,
              };
            }
            if (profile && profile.googleOAuthCredentials) {
              return {
                isConnected: true,
                channelName: 'YouTube Channel',
              };
            }
          } catch {
            // ignore profile fetch errors
          }
          return { isConnected: true };
        }

        return { isConnected: false };
      } catch (err) {
        console.error('[useYouTubeChannel] query error:', err);
        return { isConnected: false };
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
    refetchOnMount: 'always',
    retry: 2,
    retryDelay: 1000,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.');
      }
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const scope = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly',
        'openid',
        'email',
        'profile',
      ].join(' ');

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope,
        access_type: 'offline',
        prompt: 'consent',
      });

      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    },
  });

  // Derive loading state: loading if actor is still fetching OR query is loading/fetching
  const isLoading = actorFetching || channelQuery.isLoading || channelQuery.isFetching;

  const channelStatus: YouTubeChannelStatus = channelQuery.data ?? { isConnected: false };

  return {
    channelStatus,
    isLoading,
    connectChannel: connectMutation.mutate,
    isConnecting: connectMutation.isPending,
    error: connectMutation.error,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['youtubeChannel'] }),
  };
}

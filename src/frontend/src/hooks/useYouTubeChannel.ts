import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useQueries';
import { toast } from 'sonner';

interface ChannelStatus {
  isConnected: boolean;
  channelName?: string;
  channelId?: string;
  email?: string;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const REDIRECT_URI = `${window.location.origin}/oauth/callback`;

export function useYouTubeChannel() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();

  const channelQuery = useQuery<ChannelStatus>({
    queryKey: ['youtubeChannel'],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      
      const hasOAuth = await actor.hasGoogleOAuthCredentials();
      const isConnected = await actor.isYouTubeChannelConnected();
      
      if (hasOAuth && isConnected && userProfile?.googleOAuthCredentials) {
        return {
          isConnected: true,
          channelName: userProfile.youtubeAuth?.channelName || 'My Channel',
          channelId: userProfile.youtubeAuth?.channelId,
          email: userProfile.googleOAuthCredentials.idToken ? 'Connected' : undefined,
        };
      }
      
      return { isConnected: false };
    },
    enabled: !!actor && !actorFetching,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!actor) {
        throw new Error('Actor not available');
      }

      if (!GOOGLE_CLIENT_ID) {
        throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
      }

      console.log('[useYouTubeChannel] Initiating OAuth flow with Client ID:', GOOGLE_CLIENT_ID.substring(0, 20) + '...');
      
      // Build OAuth URL with required scopes for YouTube
      const scopes = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' ');
      
      const state = Math.random().toString(36).substring(7);
      sessionStorage.setItem('oauth_state', state);
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', scopes);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', state);
      
      console.log('[useYouTubeChannel] Redirecting to:', authUrl.toString());
      
      // Redirect to Google OAuth
      window.location.href = authUrl.toString();
    },
    onError: (error) => {
      console.error('[useYouTubeChannel] connectMutation error:', error);
      toast.error('Failed to connect', {
        description: error instanceof Error ? error.message : 'Could not initiate Google OAuth flow',
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      
      // Disconnect by connecting with empty/expired data
      await actor.connectYouTubeChannel(
        '',
        '',
        '',
        '',
        BigInt(0)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtubeChannel'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Google account disconnected');
    },
    onError: (error) => {
      console.error('[useYouTubeChannel] disconnectMutation error:', error);
      toast.error('Failed to disconnect', {
        description: error instanceof Error ? error.message : 'Could not disconnect Google account',
      });
    },
  });

  return {
    channelStatus: channelQuery.data,
    isLoading: channelQuery.isLoading,
    error: connectMutation.error?.message || disconnectMutation.error?.message,
    connectChannel: connectMutation.mutateAsync,
    disconnectChannel: disconnectMutation.mutateAsync,
    isConfigured: !!GOOGLE_CLIENT_ID,
  };
}

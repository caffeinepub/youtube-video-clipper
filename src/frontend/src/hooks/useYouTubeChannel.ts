import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useQueries';

interface ChannelStatus {
  isConnected: boolean;
  channelName?: string;
  channelId?: string;
}

export function useYouTubeChannel() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();

  console.log('[useYouTubeChannel] Hook initialized', {
    hasActor: !!actor,
    actorFetching,
    userProfile,
    timestamp: new Date().toISOString()
  });

  const channelQuery = useQuery<ChannelStatus>({
    queryKey: ['youtubeChannel'],
    queryFn: async () => {
      console.log('[useYouTubeChannel] channelQuery queryFn - START', {
        hasActor: !!actor,
        timestamp: new Date().toISOString()
      });
      
      if (!actor) {
        console.error('[useYouTubeChannel] channelQuery - Actor not available');
        throw new Error('Actor not available');
      }
      
      console.log('[useYouTubeChannel] Calling actor.isYouTubeChannelConnected()...');
      const isConnected = await actor.isYouTubeChannelConnected();
      console.log('[useYouTubeChannel] isYouTubeChannelConnected result:', isConnected);
      
      if (isConnected && userProfile?.youtubeAuth) {
        console.log('[useYouTubeChannel] Channel is connected, returning auth data:', {
          channelName: userProfile.youtubeAuth.channelName,
          channelId: userProfile.youtubeAuth.channelId
        });
        return {
          isConnected: true,
          channelName: userProfile.youtubeAuth.channelName,
          channelId: userProfile.youtubeAuth.channelId,
        };
      }
      
      console.log('[useYouTubeChannel] Channel not connected or no auth data');
      return { isConnected: false };
    },
    enabled: !!actor && !actorFetching,
  });

  console.log('[useYouTubeChannel] channelQuery state:', {
    data: channelQuery.data,
    isLoading: channelQuery.isLoading,
    isError: channelQuery.isError,
    error: channelQuery.error,
    timestamp: new Date().toISOString()
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      console.log('[useYouTubeChannel] connectMutation mutationFn - START', {
        hasActor: !!actor,
        timestamp: new Date().toISOString()
      });
      
      if (!actor) {
        console.error('[useYouTubeChannel] connectMutation - Actor not available');
        throw new Error('Actor not available');
      }
      
      // In a real implementation, this would open an OAuth window
      // For now, we'll simulate the OAuth flow with mock data
      const mockAccessToken = 'mock_access_token_' + Date.now();
      const mockRefreshToken = 'mock_refresh_token_' + Date.now();
      const mockChannelId = 'UC' + Math.random().toString(36).substring(7);
      const mockChannelName = 'My YouTube Channel';
      const expiresAt = BigInt(Date.now() * 1000000 + 3600000000000); // 1 hour from now in nanoseconds
      
      console.log('[useYouTubeChannel] Mock OAuth data generated:', {
        mockAccessToken,
        mockRefreshToken,
        mockChannelId,
        mockChannelName,
        expiresAt: expiresAt.toString(),
        timestamp: new Date().toISOString()
      });
      
      console.log('[useYouTubeChannel] Calling actor.connectYouTubeChannel()...');
      try {
        await actor.connectYouTubeChannel(
          mockAccessToken,
          mockRefreshToken,
          mockChannelId,
          mockChannelName,
          expiresAt
        );
        console.log('[useYouTubeChannel] actor.connectYouTubeChannel() - SUCCESS', {
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('[useYouTubeChannel] actor.connectYouTubeChannel() - ERROR', {
          error: err,
          errorMessage: err instanceof Error ? err.message : String(err),
          errorStack: err instanceof Error ? err.stack : undefined,
          timestamp: new Date().toISOString()
        });
        throw err;
      }
    },
    onMutate: () => {
      console.log('[useYouTubeChannel] connectMutation - onMutate', {
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      console.log('[useYouTubeChannel] connectMutation - onSuccess', {
        timestamp: new Date().toISOString()
      });
      console.log('[useYouTubeChannel] Invalidating queries: youtubeChannel, currentUserProfile');
      queryClient.invalidateQueries({ queryKey: ['youtubeChannel'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error) => {
      console.error('[useYouTubeChannel] connectMutation - onError', {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
    },
    onSettled: () => {
      console.log('[useYouTubeChannel] connectMutation - onSettled', {
        timestamp: new Date().toISOString()
      });
    }
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      console.log('[useYouTubeChannel] disconnectMutation mutationFn - START', {
        hasActor: !!actor,
        timestamp: new Date().toISOString()
      });
      
      if (!actor) {
        console.error('[useYouTubeChannel] disconnectMutation - Actor not available');
        throw new Error('Actor not available');
      }
      
      console.log('[useYouTubeChannel] Calling actor.connectYouTubeChannel() with empty data...');
      try {
        // Disconnect by connecting with empty/expired data
        await actor.connectYouTubeChannel(
          '',
          '',
          '',
          '',
          BigInt(0)
        );
        console.log('[useYouTubeChannel] Disconnect - SUCCESS', {
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('[useYouTubeChannel] Disconnect - ERROR', {
          error: err,
          errorMessage: err instanceof Error ? err.message : String(err),
          errorStack: err instanceof Error ? err.stack : undefined,
          timestamp: new Date().toISOString()
        });
        throw err;
      }
    },
    onMutate: () => {
      console.log('[useYouTubeChannel] disconnectMutation - onMutate', {
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      console.log('[useYouTubeChannel] disconnectMutation - onSuccess', {
        timestamp: new Date().toISOString()
      });
      console.log('[useYouTubeChannel] Invalidating queries: youtubeChannel, currentUserProfile');
      queryClient.invalidateQueries({ queryKey: ['youtubeChannel'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error) => {
      console.error('[useYouTubeChannel] disconnectMutation - onError', {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
    },
    onSettled: () => {
      console.log('[useYouTubeChannel] disconnectMutation - onSettled', {
        timestamp: new Date().toISOString()
      });
    }
  });

  console.log('[useYouTubeChannel] Mutation states:', {
    connectMutation: {
      isPending: connectMutation.isPending,
      isError: connectMutation.isError,
      error: connectMutation.error
    },
    disconnectMutation: {
      isPending: disconnectMutation.isPending,
      isError: disconnectMutation.isError,
      error: disconnectMutation.error
    },
    timestamp: new Date().toISOString()
  });

  return {
    channelStatus: channelQuery.data,
    isLoading: channelQuery.isLoading,
    error: connectMutation.error?.message || disconnectMutation.error?.message,
    connectChannel: connectMutation.mutateAsync,
    disconnectChannel: disconnectMutation.mutateAsync,
  };
}

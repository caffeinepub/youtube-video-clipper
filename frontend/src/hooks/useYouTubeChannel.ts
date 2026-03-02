import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useYouTubeChannel() {
  const { actor, isFetching } = useActor();

  const query = useQuery({
    queryKey: ['youtubeChannel'],
    queryFn: async () => {
      // Backend doesn't have YouTube channel methods
      return { isConnected: false, channelName: null, channelId: null };
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000,
  });

  return {
    isConnected: query.data?.isConnected ?? false,
    channelName: query.data?.channelName ?? null,
    channelId: query.data?.channelId ?? null,
    isLoading: isFetching || query.isLoading,
  };
}

import { useQuery } from '@tanstack/react-query';
import { getClipsStore } from './useClips';

export interface FeedItem {
  id: string;
  principal: string;
  userName: string;
  title: string;
  thumbnailUrl: string;
  startTime: number;
  endTime: number;
  score: number;
  timestamp: number;
}

export function useSocialFeed() {
  const query = useQuery<FeedItem[]>({
    queryKey: ['socialFeed'],
    queryFn: async () => {
      const clips = getClipsStore();
      return clips
        .slice(0, 50)
        .map((clip) => ({
          id: clip.id,
          principal: 'local',
          userName: 'Anonymous Player',
          title: clip.title,
          thumbnailUrl: clip.thumbnailUrl || '',
          startTime: clip.startTime,
          endTime: clip.endTime,
          score: clip.score || 0,
          timestamp: Number(clip.createdAt) / 1_000_000,
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  return {
    feedItems: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

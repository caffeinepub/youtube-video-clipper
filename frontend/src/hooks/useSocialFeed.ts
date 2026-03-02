import { useQuery } from '@tanstack/react-query';
import { useClips } from './useClips';
import { generateShortUserId } from '../utils/userIdGenerator';

interface FeedItem {
  id: string;
  userId: string;
  userInitial: string;
  clipTitle: string;
  timeRange: string;
  score: number;
  timeAgo: string;
  timestamp: number;
}

function getTimeAgo(ts: bigint | number): string {
  const ms = typeof ts === 'bigint' ? Number(ts) / 1_000_000 : Number(ts);
  const diff = Date.now() - ms;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function useSocialFeed() {
  const { data: clips = [] } = useClips();

  return useQuery({
    queryKey: ['socialFeed', clips.length],
    queryFn: async (): Promise<FeedItem[]> => {
      return clips
        .map((clip) => {
          const userId = generateShortUserId(clip.id);
          const startMin = Math.floor(clip.startTime / 60);
          const startSec = clip.startTime % 60;
          const endMin = Math.floor(clip.endTime / 60);
          const endSec = clip.endTime % 60;
          const timeRange = `${startMin}:${String(startSec).padStart(2, '0')} – ${endMin}:${String(endSec).padStart(2, '0')}`;
          const ts = typeof clip.createdAt === 'bigint' ? Number(clip.createdAt) / 1_000_000 : Number(clip.createdAt);
          return {
            id: clip.id,
            userId,
            userInitial: userId[0]?.toUpperCase() || '?',
            clipTitle: clip.title || 'Untitled Clip',
            timeRange,
            score: clip.score || 0,
            timeAgo: getTimeAgo(clip.createdAt),
            timestamp: ts,
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp);
    },
    enabled: true,
    refetchInterval: 30_000,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addClipToStore } from './useClips';
import type { VideoClip } from '../types/app';

interface CreateClipParams {
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  startTime: number;
  endTime: number;
}

function calculateViralScore(params: CreateClipParams): number {
  const duration = params.endTime - params.startTime;
  let score = 50;
  if (duration >= 15 && duration <= 60) score += 20;
  if (duration < 15) score += 10;
  if (params.title.length > 10) score += 10;
  const keywords = ['epic', 'clutch', 'insane', 'crazy', 'best', 'win', 'kill', 'ace'];
  if (keywords.some((k) => params.title.toLowerCase().includes(k))) score += 20;
  return Math.min(100, score);
}

export function useClipCreation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: CreateClipParams) => {
      const score = calculateViralScore(params);
      const clip: VideoClip = {
        id: `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: params.title,
        videoUrl: params.videoUrl,
        thumbnailUrl: params.thumbnailUrl,
        startTime: params.startTime,
        endTime: params.endTime,
        createdAt: BigInt(Date.now() * 1_000_000),
        score,
      };
      addClipToStore(clip);
      return clip;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] });
      queryClient.invalidateQueries({ queryKey: ['trendingClips'] });
      toast.success('Clip saved!');
    },
    onError: () => {
      toast.error('Failed to save clip');
    },
  });

  return mutation;
}

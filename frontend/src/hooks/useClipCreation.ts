import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Calculate a viral potential score based on clip characteristics
function calculateViralScore(startTime: number, endTime: number, title: string): number {
  const duration = endTime - startTime;
  
  // Ideal duration for viral clips: 15-60 seconds
  let durationScore = 0;
  if (duration >= 15 && duration <= 60) {
    durationScore = 100;
  } else if (duration < 15) {
    durationScore = (duration / 15) * 100;
  } else if (duration <= 90) {
    durationScore = 100 - ((duration - 60) / 30) * 30;
  } else {
    durationScore = Math.max(0, 70 - ((duration - 90) / 30) * 10);
  }

  // Title engagement factors
  let titleScore = 50;
  const titleLower = title.toLowerCase();
  const viralKeywords = ['epic', 'insane', 'crazy', 'amazing', 'unbelievable', 'shocking', 'best', 'worst', 'fail', 'win', 'moment', 'reaction'];
  const hasViralKeyword = viralKeywords.some(keyword => titleLower.includes(keyword));
  if (hasViralKeyword) titleScore += 20;
  if (title.includes('!')) titleScore += 10;
  if (title.length >= 10 && title.length <= 60) titleScore += 20;

  // Weighted average
  const finalScore = (durationScore * 0.7) + (titleScore * 0.3);
  
  return Math.round(Math.min(100, Math.max(0, finalScore)));
}

export function useClipCreation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      title,
      videoUrl,
      thumbnailUrl,
      startTime,
      endTime,
    }: {
      title: string;
      videoUrl: string;
      thumbnailUrl: string;
      startTime: number;
      endTime: number;
    }) => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }

      const viralScore = calculateViralScore(startTime, endTime, title);

      return await actor.saveClip(
        title,
        videoUrl,
        thumbnailUrl,
        BigInt(startTime),
        BigInt(endTime),
        viralScore
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] });
      queryClient.invalidateQueries({ queryKey: ['trendingClips'] });
    },
  });

  const createClip = async (
    title: string,
    videoUrl: string,
    thumbnailUrl: string,
    startTime: number,
    endTime: number
  ) => {
    return mutation.mutateAsync({
      title,
      videoUrl,
      thumbnailUrl,
      startTime,
      endTime,
    });
  };

  return {
    createClip,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}

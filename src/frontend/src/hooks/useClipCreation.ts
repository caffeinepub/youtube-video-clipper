import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

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

      return await actor.saveClip(
        title,
        videoUrl,
        thumbnailUrl,
        BigInt(startTime),
        BigInt(endTime)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] });
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

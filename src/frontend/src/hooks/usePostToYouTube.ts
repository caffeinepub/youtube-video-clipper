import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ClipMetadata, YouTubePostResult } from '../backend';

export function usePostToYouTube() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<YouTubePostResult, Error, ClipMetadata>({
    mutationFn: async (clipMetadata: ClipMetadata) => {
      if (!actor) throw new Error('Actor not available');
      
      const result = await actor.postClipToYouTube(clipMetadata);
      
      if (!result.success) {
        throw new Error(result.errorMessage || 'Failed to post clip to YouTube');
      }
      
      return result;
    },
    onSuccess: () => {
      // Optionally invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ['clips'] });
    },
  });
}

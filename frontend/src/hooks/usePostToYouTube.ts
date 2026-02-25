import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ClipMetadata, YouTubePostResult } from '../backend';

export function usePostToYouTube() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<YouTubePostResult, Error, ClipMetadata>({
    mutationFn: async (clipMetadata: ClipMetadata) => {
      if (!actor) throw new Error('Actor not available');
      
      // Check if Google account is connected
      const hasOAuth = await actor.hasGoogleOAuthCredentials();
      if (!hasOAuth) {
        throw new Error('Please connect your Google account first to post to YouTube');
      }
      
      // Validate clip duration for YouTube Shorts (max 60 seconds)
      const startSec = Number(clipMetadata.startTimestamp);
      const endSec = Number(clipMetadata.endTimestamp);
      const durationSeconds = endSec - startSec;
      
      if (durationSeconds > 60) {
        throw new Error(
          `YouTube Shorts must be 60 seconds or less. Your clip is ${durationSeconds} seconds. Please adjust the timestamps.`
        );
      }
      
      const result = await actor.postClipToYouTube(clipMetadata);
      
      if (!result.success) {
        throw new Error(result.errorMessage || 'Failed to post clip to YouTube');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] });
    },
  });
}

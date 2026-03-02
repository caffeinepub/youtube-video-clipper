import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ClipMetadata } from '../types/app';

export function usePostToYouTube() {
  return useMutation({
    mutationFn: async (clipMetadata: ClipMetadata) => {
      // Backend doesn't have YouTube posting methods
      await new Promise((r) => setTimeout(r, 1000));
      toast.info('YouTube posting not available in this version');
      return { success: false, videoUrl: '', errorMessage: 'Not available' };
    },
    onError: () => {
      toast.error('Failed to post to YouTube');
    },
  });
}

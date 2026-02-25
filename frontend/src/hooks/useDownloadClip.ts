import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

interface DownloadClipParams {
  videoId: string;
  startTimestamp: bigint;
  endTimestamp: bigint;
  title: string;
}

export function useDownloadClip() {
  const { actor } = useActor();

  return useMutation<void, Error, DownloadClipParams>({
    mutationFn: async ({ videoId, startTimestamp, endTimestamp, title }: DownloadClipParams) => {
      if (!actor) throw new Error('Actor not available');

      // Get download URL from backend
      const downloadUrl = await actor.generateDownloadVideoUrl(
        videoId,
        startTimestamp,
        endTimestamp
      );

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Generate filename from title and timestamps
      const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const startSec = Number(startTimestamp);
      const endSec = Number(endTimestamp);
      link.download = `${sanitizedTitle}_${startSec}-${endSec}.mp4`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started!');
    },
    onError: (error) => {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download clip');
    },
  });
}

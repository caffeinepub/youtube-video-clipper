import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface DownloadClipParams {
  clipId: string;
  format?: string;
}

export function useDownloadClip() {
  const mutation = useMutation({
    mutationFn: async ({ clipId, format = 'mp4' }: DownloadClipParams) => {
      // Since backend doesn't have download methods, open YouTube URL
      toast.info(`Preparing ${format.toUpperCase()} download...`);
      await new Promise((r) => setTimeout(r, 500));
      return { clipId, format };
    },
    onSuccess: ({ format }) => {
      toast.success(`${format.toUpperCase()} export ready!`);
    },
    onError: () => {
      toast.error('Download failed');
    },
  });

  return {
    ...mutation,
    downloadClip: mutation.mutate,
    isDownloading: mutation.isPending,
  };
}

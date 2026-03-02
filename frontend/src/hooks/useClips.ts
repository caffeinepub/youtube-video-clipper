import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { VideoClip } from '../types/app';

// In-memory clip store since backend doesn't have clip methods
let clipsStore: VideoClip[] = [];
let clipsListeners: Array<() => void> = [];

export function notifyClipsListeners() {
  clipsListeners.forEach((fn) => fn());
}

export function addClipToStore(clip: VideoClip) {
  clipsStore = [clip, ...clipsStore];
  notifyClipsListeners();
}

export function removeClipFromStore(id: string) {
  clipsStore = clipsStore.filter((c) => c.id !== id);
  notifyClipsListeners();
}

export function getClipsStore(): VideoClip[] {
  return clipsStore;
}

export function useClips() {
  const queryClient = useQueryClient();

  const query = useQuery<VideoClip[]>({
    queryKey: ['clips'],
    queryFn: async () => {
      return [...clipsStore];
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const deleteMutation = useMutation({
    mutationFn: async (clipId: string) => {
      removeClipFromStore(clipId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] });
    },
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    deleteClip: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.variables,
  };
}

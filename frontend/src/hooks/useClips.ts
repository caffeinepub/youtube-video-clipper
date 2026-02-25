import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VideoClip } from '../backend';
import { useState } from 'react';

export function useClips() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [isDeletingClip, setIsDeletingClip] = useState<string | null>(null);

  const { data: clips = [], isLoading } = useQuery<VideoClip[]>({
    queryKey: ['clips'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllClips('');
    },
    enabled: !!actor && !isFetching,
  });

  const deleteMutation = useMutation({
    mutationFn: async (clipId: string) => {
      if (!actor) throw new Error('Actor not available');
      setIsDeletingClip(clipId);
      await actor.deleteClip(clipId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] });
      setIsDeletingClip(null);
    },
    onError: () => {
      setIsDeletingClip(null);
    },
  });

  return {
    clips,
    isLoading,
    deleteClip: deleteMutation.mutate,
    isDeletingClip,
  };
}

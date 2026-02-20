import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Clip } from '../backend';

export function useClips() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [isDeletingClip, setIsDeletingClip] = useState<string | null>(null);

  const clipsQuery = useQuery<Clip[]>({
    queryKey: ['clips'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllClips();
    },
    enabled: !!actor && !isFetching,
  });

  const deleteMutation = useMutation({
    mutationFn: async (clipId: string) => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      setIsDeletingClip(clipId);
      return await actor.deleteClip(clipId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] });
    },
    onSettled: () => {
      setIsDeletingClip(null);
    },
  });

  const deleteClip = (clipId: string) => {
    deleteMutation.mutate(clipId);
  };

  return {
    clips: clipsQuery.data || [],
    isLoading: clipsQuery.isLoading,
    deleteClip,
    isDeletingClip,
  };
}

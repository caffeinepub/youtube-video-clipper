import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import type { ScheduledUpload } from '../types/app';

let scheduledStore: ScheduledUpload[] = [];
let scheduledIdCounter = 1;

export function useScheduledUploads() {
  const { actor, isFetching } = useActor();

  return useQuery<ScheduledUpload[]>({
    queryKey: ['scheduledUploads'],
    queryFn: async () => [...scheduledStore],
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useAddScheduledUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clipId, scheduledAt }: { clipId: string; scheduledAt: bigint }) => {
      const entry: ScheduledUpload = {
        id: `sched-${scheduledIdCounter++}`,
        clipId,
        scheduledAt,
        createdAt: BigInt(Date.now() * 1_000_000),
      };
      scheduledStore = [entry, ...scheduledStore];
      return entry.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledUploads'] });
      toast.success('Upload scheduled');
    },
    onError: () => {
      toast.error('Failed to schedule upload');
    },
  });
}

export function useDeleteScheduledUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      scheduledStore = scheduledStore.filter((e) => e.id !== entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledUploads'] });
      toast.success('Schedule removed');
    },
    onError: () => {
      toast.error('Failed to remove schedule');
    },
  });
}

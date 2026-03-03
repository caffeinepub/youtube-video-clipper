import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ScheduledUpload } from '../backend';
import { toast } from 'sonner';
import { useInternetIdentity } from './useInternetIdentity';

export function useScheduledUploads() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ScheduledUpload[]>({
    queryKey: ['scheduledUploads'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyScheduledUploads();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddScheduledUpload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clipId, scheduledAt }: { clipId: string; scheduledAt: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      const id = await actor.addScheduledUpload(clipId, scheduledAt);
      try {
        await actor.logUserActivity('scheduler_add');
      } catch (_) {}
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledUploads'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Upload scheduled successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to schedule upload: ${error.message}`);
    },
  });
}

export function useDeleteScheduledUpload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteScheduledUpload(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledUploads'] });
      toast.success('Scheduled upload removed');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove scheduled upload: ${error.message}`);
    },
  });
}

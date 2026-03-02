import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useDeleteFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await (actor as any).deleteFeedbackSubmission?.(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackSubmissions'] });
      toast.success('Feedback deleted');
    },
    onError: (err: any) => {
      toast.error(`Failed to delete: ${err.message}`);
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      // Local store deletion handled in useFeedbackSubmit
      console.log('Delete feedback:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackSubmissions'] });
      toast.success('Feedback deleted');
    },
    onError: () => {
      toast.error('Failed to delete feedback');
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { SubmissionType } from '../backend';
import { toast } from 'sonner';

interface SubmitFeedbackParams {
  submissionType: SubmissionType;
  title: string;
  description: string;
}

export function useFeedbackSubmit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ submissionType, title, description }: SubmitFeedbackParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFeedback(submissionType, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackSubmissions'] });
      toast.success('Feedback submitted successfully! Thank you.');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.');
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

interface FeedbackParams {
  submissionType: { BugReport: null } | { FeatureRequest: null };
  title: string;
  description: string;
}

export function useFeedbackSubmit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: FeedbackParams) => {
      if (!actor) throw new Error('Actor not available');
      await (actor as any).submitFeedback?.(params.submissionType, params.title, params.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackSubmissions'] });
    },
    onError: (err: any) => {
      console.error('Feedback submit error:', err);
    },
  });
}

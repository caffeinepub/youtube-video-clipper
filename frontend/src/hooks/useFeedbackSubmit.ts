import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SubmissionType, FeedbackSubmission } from '../types/app';

let feedbackStore: FeedbackSubmission[] = [];
let feedbackIdCounter = 1;

export function getFeedbackStore(): FeedbackSubmission[] {
  return feedbackStore;
}

export function useFeedbackSubmit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionType,
      title,
      description,
    }: {
      submissionType: SubmissionType;
      title: string;
      description: string;
    }) => {
      const submission: FeedbackSubmission = {
        id: BigInt(feedbackIdCounter++),
        submitterPrincipal: 'local',
        submitterUserId: 'local',
        submissionType,
        title,
        description,
        timestamp: Date.now(),
      };
      feedbackStore = [submission, ...feedbackStore];
      return submission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackSubmissions'] });
      toast.success('Feedback submitted!');
    },
    onError: () => {
      toast.error('Failed to submit feedback');
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getFeedbackStore } from './useFeedbackSubmit';
import type { FeedbackSubmission } from '../types/app';

export function useFeedbackSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<FeedbackSubmission[]>({
    queryKey: ['feedbackSubmissions'],
    queryFn: async () => {
      return getFeedbackStore();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10000,
  });
}

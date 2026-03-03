import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FeedbackSubmission } from '../backend';

export function useFeedbackSubmissions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FeedbackSubmission[]>({
    queryKey: ['feedbackSubmissions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeedbackSubmissions();
    },
    enabled: !!actor && !actorFetching,
  });
}

import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useFeedbackSubmissions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['feedbackSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).getFeedbackSubmissions?.();
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

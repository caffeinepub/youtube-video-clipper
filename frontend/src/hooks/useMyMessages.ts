import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AdminMessage } from '../types/app';

let messagesStore: AdminMessage[] = [];

export function addMessageToStore(msg: AdminMessage) {
  messagesStore = [msg, ...messagesStore];
}

export function useMyMessages(myUserId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<AdminMessage[]>({
    queryKey: ['myMessages', myUserId],
    queryFn: async () => {
      return messagesStore.filter(
        (m) => m.toUserId === myUserId || m.fromUserId === myUserId
      );
    },
    enabled: !!actor && !isFetching && !!myUserId,
    staleTime: 10000,
  });
}

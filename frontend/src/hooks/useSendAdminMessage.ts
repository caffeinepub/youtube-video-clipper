import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addMessageToStore } from './useMyMessages';
import type { AdminMessage } from '../types/app';

export function useSendAdminMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      toPrincipal,
      toUserId,
      body,
      fromUserId,
    }: {
      toPrincipal: string;
      toUserId: string;
      body: string;
      fromUserId: string;
    }) => {
      const msg: AdminMessage = {
        id: `msg-${Date.now()}`,
        fromPrincipal: 'local',
        toPrincipal,
        fromUserId,
        toUserId,
        body,
        sentAt: BigInt(Date.now() * 1_000_000),
      };
      addMessageToStore(msg);
      return msg;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMessages'] });
      toast.success('Message sent');
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
}

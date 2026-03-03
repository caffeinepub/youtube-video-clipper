import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { generateShortUserId } from '../utils/userIdGenerator';
import { toast } from 'sonner';

interface SendMessageParams {
  toUserId: string; // principal string of recipient
  body: string;
}

export function useSendAdminMessage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const principalStr = identity?.getPrincipal().toString() ?? '';
  const fromUserId = principalStr ? generateShortUserId(principalStr) : '';

  return useMutation({
    mutationFn: async ({ toUserId, body }: SendMessageParams) => {
      if (!actor) throw new Error('Actor not available');
      const recipientUserId = generateShortUserId(toUserId);
      return actor.sendMessage(toUserId, recipientUserId, body, fromUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Message sent successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
}

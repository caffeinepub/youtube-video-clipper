import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

interface SendMessageParams {
  toUserId: string;
  body: string;
}

export function useSendAdminMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ toUserId, body }: SendMessageParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendAdminMessage(toUserId, body);
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

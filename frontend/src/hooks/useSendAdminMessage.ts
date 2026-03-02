import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { generateShortUserId } from '../utils/userIdGenerator';
import { toast } from 'sonner';

export function useSendAdminMessage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { toPrincipal: string; toUserId: string; body: string }) => {
      if (!actor) throw new Error('Actor not available');
      const fromPrincipal = identity?.getPrincipal().toString() || '';
      const fromUserId = fromPrincipal ? generateShortUserId(fromPrincipal) : 'admin';
      await (actor as any).sendMessage?.({
        toPrincipal: params.toPrincipal,
        toUserId: params.toUserId,
        body: params.body,
        fromUserId,
        fromPrincipal,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMessages'] });
      toast.success('Message sent successfully!');
    },
    onError: (err: any) => {
      toast.error(`Failed to send message: ${err.message}`);
    },
  });
}

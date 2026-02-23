import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import { UserStatus } from '../backend';
import { toast } from 'sonner';

export function useSetUserStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ target, status }: { target: Principal; status: UserStatus }) => {
      if (!actor) throw new Error('Actor not available');
      
      await actor.updateUserStatus(target, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['allUserRoles'] });
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('User status updated successfully');
    },
    onError: (error) => {
      console.error('[useSetUserStatus] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user status';
      toast.error(errorMessage);
    },
  });
}

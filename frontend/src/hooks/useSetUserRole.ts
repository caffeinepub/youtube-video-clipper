import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import { UserRole } from '../backend';
import { toast } from 'sonner';

export function useSetUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ target, role }: { target: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      
      await actor.setUserRole(target, role);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      queryClient.invalidateQueries({ queryKey: ['ownRole'] });
      queryClient.invalidateQueries({ queryKey: ['isOwner'] });
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      console.error('[useSetUserRole] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user role';
      toast.error(errorMessage);
    },
  });
}

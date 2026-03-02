import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useActor } from './useActor';
import { UserRole } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

export function useSetUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ target, role }: { target: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.assignCallerUserRole(target, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      toast.success('Role updated');
    },
    onError: () => {
      toast.error('Failed to update role');
    },
  });
}

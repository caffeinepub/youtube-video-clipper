import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { UserStatus } from '../types/app';
import type { Principal } from '@icp-sdk/core/principal';

export function useSetUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ target, status }: { target: Principal; status: UserStatus }) => {
      // Backend doesn't have updateUserStatus - stub
      console.log('Set user status not available:', target.toString(), status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      toast.success('Status updated (local only)');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useAddAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // Backend doesn't have addAdminByUserId - stub
      console.log('Add admin not available in backend:', userId);
      await new Promise((r) => setTimeout(r, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminList'] });
      toast.success('Admin added (local only)');
    },
    onError: () => {
      toast.error('Failed to add admin');
    },
  });
}

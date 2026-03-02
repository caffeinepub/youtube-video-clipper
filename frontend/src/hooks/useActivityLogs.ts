import { useQuery } from '@tanstack/react-query';
import type { ActivityLog } from '../types/app';

// In-memory activity log store
let activityLogs: ActivityLog[] = [];

export function addActivityLog(userPrincipal: string, action: string) {
  activityLogs = [
    {
      id: `log-${Date.now()}`,
      userPrincipal,
      action,
      timestamp: BigInt(Date.now() * 1_000_000),
    },
    ...activityLogs,
  ];
}

export function useActivityLogs() {
  return useQuery<ActivityLog[]>({
    queryKey: ['activityLogs'],
    queryFn: async () => [...activityLogs],
    staleTime: 10000,
  });
}

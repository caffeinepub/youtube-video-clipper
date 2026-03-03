import { useQuery } from "@tanstack/react-query";
import type { ActivityLog } from "../backend";
import { useActor } from "./useActor";
import { useIsOwner } from "./useIsOwner";

export function useActivityLogs() {
  const { actor, isFetching } = useActor();
  const { data: isAdmin } = useIsOwner();

  return useQuery<ActivityLog[]>({
    queryKey: ["activityLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivityLogs();
    },
    enabled: !!actor && !isFetching && !!isAdmin,
    refetchInterval: 15_000,
  });
}

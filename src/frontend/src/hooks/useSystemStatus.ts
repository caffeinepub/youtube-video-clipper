import { useQuery } from "@tanstack/react-query";
import { SystemStatus } from "../backend";
import { useActor } from "./useActor";

export function useSystemStatus() {
  const { actor } = useActor();

  return useQuery<SystemStatus>({
    queryKey: ["systemStatus"],
    queryFn: async () => {
      if (!actor) return SystemStatus.running;
      return actor.getSystemStatus();
    },
    enabled: !!actor,
    refetchInterval: 10_000,
    staleTime: 5_000,
  });
}

import { useQuery } from "@tanstack/react-query";
import type { AdminMessage } from "../backend";
import { generateShortUserId } from "../utils/userIdGenerator";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useMyMessages() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const principalStr = identity?.getPrincipal().toString() ?? "";
  const myUserId = principalStr ? generateShortUserId(principalStr) : "";

  return useQuery<AdminMessage[]>({
    queryKey: ["myMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyMessages(myUserId);
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 30_000,
  });
}

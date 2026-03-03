import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export interface AdminDebugInfo {
  currentPrincipal: string;
  isAdmin: boolean;
  adminPrincipals: string[];
  hashMapSize: number;
  initializationStatus: string;
}

export function useAdminDebug() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<AdminDebugInfo>({
    queryKey: ["adminDebug"],
    queryFn: async () => {
      if (!actor || !identity) {
        throw new Error("Actor or identity not available");
      }

      const currentPrincipal = identity.getPrincipal().toString();

      try {
        console.log("[useAdminDebug] Fetching debug info...");

        // Check if current user is admin
        const isAdmin = await actor.isCallerAdmin();

        console.log("[useAdminDebug] Basic debug info:", {
          currentPrincipal,
          isAdmin,
          timestamp: new Date().toISOString(),
        });

        // Note: Backend doesn't have getAdminDebugInfo() method yet
        // Returning placeholder data until backend is updated
        return {
          currentPrincipal,
          isAdmin,
          adminPrincipals: [], // Will be populated when backend method is available
          hashMapSize: 0, // Will be populated when backend method is available
          initializationStatus: "Backend method not yet implemented", // Will be populated when backend method is available
        };
      } catch (error) {
        console.error("[useAdminDebug] Error fetching debug info:", error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 1,
    staleTime: 5000, // 5 seconds
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

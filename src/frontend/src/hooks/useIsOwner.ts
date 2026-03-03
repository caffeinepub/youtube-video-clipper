import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useIsOwner() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ["isOwner"],
    queryFn: async () => {
      const timestamp = new Date().toISOString();
      console.group(`[useIsOwner] ${timestamp} - Executing Query`);

      if (!actor) {
        console.error(
          "[useIsOwner] Actor not available - this should not happen due to enabled condition",
        );
        console.groupEnd();
        throw new Error("Actor not available");
      }

      const principalId = identity?.getPrincipal().toString() || "unknown";
      console.log(
        "[useIsOwner] Calling backend isCallerAdmin() for principal:",
        principalId,
      );

      try {
        const result = await actor.isCallerAdmin();
        console.log("[useIsOwner] Backend isCallerAdmin() returned:", result);
        console.log("[useIsOwner] Result type:", typeof result);

        // Also fetch user profile to see stored email
        try {
          const profile = await actor.getCallerUserProfile();
          console.log("[useIsOwner] User profile:", profile);
          if (profile?.name) {
            const parts = profile.name.split("|");
            if (parts.length === 2) {
              console.log(
                "[useIsOwner] Extracted email from profile:",
                parts[1],
              );
            }
          }
        } catch (profileError) {
          console.log(
            "[useIsOwner] Could not fetch profile (may not exist yet):",
            profileError,
          );
        }

        console.groupEnd();
        return result;
      } catch (error) {
        console.error("[useIsOwner] Backend call failed:", error);
        console.groupEnd();
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 1,
    retryDelay: 500,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Log state changes
  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.group(`[useIsOwner] ${timestamp} - State Update`);
    console.log("Dependencies:", {
      actorAvailable: !!actor,
      actorFetching,
      identityAvailable: !!identity,
      principalId: identity?.getPrincipal().toString() || "none",
    });
    console.log("Query State:", {
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isFetched: query.isFetched,
      isSuccess: query.isSuccess,
      isError: query.isError,
      data: query.data,
      error: query.error?.toString(),
      enabled: !!actor && !actorFetching && !!identity,
    });
    console.log("Computed Return Values:", {
      isLoading: actorFetching || query.isLoading,
      isFetched: !!actor && query.isFetched,
      isOwner: query.data ?? false,
    });
    console.groupEnd();
  }, [
    actor,
    actorFetching,
    identity,
    query.isLoading,
    query.isFetching,
    query.isFetched,
    query.isSuccess,
    query.isError,
    query.data,
    query.error,
  ]);

  // Return custom state that properly reflects actor dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
    isOwner: query.data ?? false,
  };
}

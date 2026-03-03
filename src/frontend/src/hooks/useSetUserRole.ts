import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UserRole } from "../backend";
import { useActor } from "./useActor";

export function useSetUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      target,
      role,
    }: { target: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Actor not available");

      await actor.setUserRole(target, role);
    },
    onSuccess: (_, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
      queryClient.invalidateQueries({ queryKey: ["ownRole"] });
      queryClient.invalidateQueries({ queryKey: ["isOwner"] });
      toast.success("User role updated successfully");
    },
    onError: (error) => {
      console.error("[useSetUserRole] Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user role";
      toast.error(errorMessage);
    },
  });
}

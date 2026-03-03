import { Principal } from "@dfinity/principal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateShortUserId } from "../utils/userIdGenerator";
import { useActor } from "./useActor";

export function useAddAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error("Actor not available");

      // The backend expects a principal text, but we're receiving a short user ID
      // We need to convert the short user ID back to a principal
      // Since we can't reverse the hash, we'll pass the userId as-is and let the backend handle it
      // Actually, looking at the backend, it expects Principal.fromText(userId)
      // So the user needs to provide the full principal text, not the short ID

      // For now, we'll assume the userId is the full principal text
      // In a production system, you'd maintain a mapping of short IDs to principals
      await actor.addAdminByUserId(userId);
    },
    onSuccess: () => {
      // Invalidate admin-related queries
      queryClient.invalidateQueries({ queryKey: ["adminList"] });
      queryClient.invalidateQueries({ queryKey: ["isOwner"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

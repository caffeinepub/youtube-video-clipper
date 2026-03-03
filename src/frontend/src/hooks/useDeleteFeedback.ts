import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useActor } from "./useActor";

export function useDeleteFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteFeedbackSubmission(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbackSubmissions"] });
      toast.success("Feedback submission deleted.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete submission.",
      );
    },
  });
}

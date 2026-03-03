import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ClipMetadata } from "../backend";
import { useActor } from "./useActor";

const YOUTUBE_POST_TIMEOUT_MS = 30_000;

export function usePostToYouTube() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clipMetadata: ClipMetadata) => {
      if (!actor) throw new Error("Not connected to backend");

      // Check YouTube channel connection first
      let isConnected = false;
      try {
        isConnected = await actor.isYouTubeChannelConnected();
      } catch {
        throw new Error("Failed to check YouTube connection status");
      }

      if (!isConnected) {
        throw new Error(
          "YouTube channel not connected. Please connect your channel first.",
        );
      }

      // Race the actual post against a timeout
      const postPromise = actor.postClipToYouTube(clipMetadata);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                "YouTube post timed out after 30 seconds. Please try again.",
              ),
            ),
          YOUTUBE_POST_TIMEOUT_MS,
        ),
      );

      const result = await Promise.race([postPromise, timeoutPromise]);

      if (!result.success) {
        throw new Error(
          result.errorMessage || "Failed to post clip to YouTube",
        );
      }

      return result;
    },
    onSuccess: (result) => {
      toast.success("Clip posted to YouTube!", {
        description: result.videoUrl
          ? `View at: ${result.videoUrl}`
          : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["clips"] });
    },
    onError: (error: Error) => {
      toast.error("YouTube post failed", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });
}

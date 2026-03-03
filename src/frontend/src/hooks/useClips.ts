import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { VideoClip } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useClips() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const query = useQuery<VideoClip[]>({
    queryKey: ["myClips", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClips("");
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  const deleteMutation = useMutation({
    mutationFn: async (clipId: string) => {
      if (!actor) throw new Error("Actor not available");
      setIsDeletingId(clipId);
      await actor.deleteClip(clipId);
      try {
        await actor.logUserActivity("clip_deleted");
      } catch (_) {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myClips"] });
      queryClient.invalidateQueries({ queryKey: ["trendingClips"] });
      queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
      setIsDeletingId(null);
      toast.success("Clip deleted");
    },
    onError: (error: Error) => {
      setIsDeletingId(null);
      toast.error(`Failed to delete clip: ${error.message}`);
    },
  });

  return {
    ...query,
    deleteClip: deleteMutation.mutate,
    isDeletingId,
  };
}

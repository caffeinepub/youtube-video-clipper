import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ContentEntry } from "../backend";
import { useActor } from "./useActor";

export function useContentEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<ContentEntry[]>({
    queryKey: ["contentEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContentEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateContentEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, body }: { title: string; body: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createContentEntry(title, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentEntries"] });
      toast.success("Content entry created");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create entry: ${error.message}`);
    },
  });
}

export function useUpdateContentEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      body,
    }: { id: string; title: string; body: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateContentEntry(id, title, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentEntries"] });
      toast.success("Content entry updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update entry: ${error.message}`);
    },
  });
}

export function useDeleteContentEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteContentEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentEntries"] });
      toast.success("Content entry deleted");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete entry: ${error.message}`);
    },
  });
}

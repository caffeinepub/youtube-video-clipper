import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import type { ContentEntry } from '../types/app';

let contentStore: ContentEntry[] = [];
let contentIdCounter = 1;

export function useContentEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<ContentEntry[]>({
    queryKey: ['contentEntries'],
    queryFn: async () => [...contentStore],
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useCreateContentEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, body }: { title: string; body: string }) => {
      const entry: ContentEntry = {
        id: `content-${contentIdCounter++}`,
        title,
        body,
        createdAt: BigInt(Date.now() * 1_000_000),
        updatedAt: BigInt(Date.now() * 1_000_000),
      };
      contentStore = [entry, ...contentStore];
      return entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentEntries'] });
      toast.success('Content created');
    },
    onError: () => {
      toast.error('Failed to create content');
    },
  });
}

export function useUpdateContentEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, body }: { id: string; title: string; body: string }) => {
      contentStore = contentStore.map((e) =>
        e.id === id ? { ...e, title, body, updatedAt: BigInt(Date.now() * 1_000_000) } : e
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentEntries'] });
      toast.success('Content updated');
    },
    onError: () => {
      toast.error('Failed to update content');
    },
  });
}

export function useDeleteContentEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      contentStore = contentStore.filter((e) => e.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentEntries'] });
      toast.success('Content deleted');
    },
    onError: () => {
      toast.error('Failed to delete content');
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import type { TrendingClipAnalytics } from "../backend";
import { useActor } from "./useActor";

export function useAdminStats() {
  const { actor, isFetching } = useActor();

  const totalClipsQuery = useQuery<bigint>({
    queryKey: ["adminStats", "totalClips"],
    queryFn: async () => {
      if (!actor) {
        throw new Error("Actor not available");
      }
      try {
        const result = await actor.getTotalClipsCount();
        console.log("[useAdminStats] Total clips count:", result);
        return result;
      } catch (error) {
        console.error("[useAdminStats] Error fetching total clips:", error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 10000,
  });

  const trendingAnalyticsQuery = useQuery<TrendingClipAnalytics[]>({
    queryKey: ["adminStats", "trendingAnalytics"],
    queryFn: async () => {
      if (!actor) {
        throw new Error("Actor not available");
      }
      try {
        const result = await actor.getTrendingClipsAnalytics();
        console.log("[useAdminStats] Trending analytics:", result);
        return result;
      } catch (error) {
        console.error(
          "[useAdminStats] Error fetching trending analytics:",
          error,
        );
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 10000,
  });

  return {
    totalClips: totalClipsQuery.data,
    trendingAnalytics: trendingAnalyticsQuery.data || [],
    isLoading: totalClipsQuery.isLoading || trendingAnalyticsQuery.isLoading,
    error: totalClipsQuery.error || trendingAnalyticsQuery.error,
  };
}

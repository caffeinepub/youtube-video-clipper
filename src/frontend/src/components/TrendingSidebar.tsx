import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, Flame, TrendingUp } from "lucide-react";
import React from "react";
import { useAdminStats } from "../hooks/useAdminStats";

export default function TrendingSidebar() {
  const { trendingAnalytics, isLoading } = useAdminStats();

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-indigo-400" />
        <h3 className="text-white font-semibold text-sm">Trending Now</h3>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {["s1", "s2", "s3", "s4", "s5"].map((k) => (
            <Skeleton key={k} className="h-12 bg-white/5 rounded-lg" />
          ))}
        </div>
      ) : !trendingAnalytics || trendingAnalytics.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center">
          <BarChart2 className="w-8 h-8 text-muted-foreground mb-2 opacity-30" />
          <p className="text-muted-foreground text-xs">No trending clips yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {trendingAnalytics.slice(0, 5).map((clip, index) => (
            <div
              key={clip.id}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-all hover:bg-white/5 ${
                index === 0
                  ? "bg-indigo-500/10 border border-indigo-500/20"
                  : ""
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  index === 0
                    ? "bg-yellow-400/20 text-yellow-400"
                    : index === 1
                      ? "bg-gray-400/20 text-gray-300"
                      : index === 2
                        ? "bg-orange-400/20 text-orange-400"
                        : "bg-white/5 text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  {clip.title}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Flame className="w-2.5 h-2.5 text-orange-400" />
                  <span className="text-orange-400 text-xs">
                    {clip.trendingScore.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

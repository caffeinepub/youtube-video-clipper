import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Loader2,
  MousePointerClick,
  TrendingUp,
  Video,
} from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useActor } from "../hooks/useActor";
import { useAdminStats } from "../hooks/useAdminStats";

function useVideosPerHour() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["videosPerHour"],
    queryFn: async () => {
      if (!actor) return [];
      const data = await actor.getVideosPerHour();
      return data
        .map((d) => ({
          hour: Number(d.hour),
          count: Number(d.count),
          label: `${Number(d.hour)}h ago`,
        }))
        .sort((a, b) => b.hour - a.hour);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

function useClickStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["clickStats"],
    queryFn: async () => {
      if (!actor) return 0;
      const count = await actor.getClickStats();
      return Number(count);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-indigo-400 font-semibold">
          {payload[0].value} videos
        </p>
      </div>
    );
  }
  return null;
};

export default function AppAnalytics() {
  const {
    totalClips,
    trendingAnalytics,
    isLoading: statsLoading,
  } = useAdminStats();
  const { data: videosPerHour, isLoading: chartLoading } = useVideosPerHour();
  const { data: clickStats, isLoading: clickLoading } = useClickStats();

  const statCards = [
    {
      label: "Total Clips",
      value: statsLoading ? "—" : String(totalClips ?? 0),
      icon: Video,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Trending Clips",
      value: statsLoading ? "—" : String(trendingAnalytics?.length ?? 0),
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Click Interactions",
      value: clickLoading ? "—" : String(clickStats ?? 0),
      icon: MousePointerClick,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Activity Events",
      value: statsLoading ? "—" : "—",
      icon: Activity,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-3.5 h-3.5 ${card.color}`} />
                </div>
                <span className="text-muted-foreground text-xs">
                  {card.label}
                </span>
              </div>
              {statsLoading || clickLoading ? (
                <Skeleton className="h-7 w-16 bg-white/5" />
              ) : (
                <p className="text-white font-bold text-2xl font-display">
                  {card.value}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Videos Per Hour Chart */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-4 h-4 text-indigo-400" />
          <h3 className="text-white font-semibold text-sm">Videos Per Hour</h3>
          <span className="text-muted-foreground text-xs ml-auto">
            Last 24h
          </span>
        </div>

        {chartLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : !videosPerHour || videosPerHour.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Video className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={videosPerHour}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "oklch(0.55 0.02 264)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.55 0.02 264)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="oklch(0.55 0.22 264)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

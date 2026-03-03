import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart2,
  Crown,
  Eye,
  Flame,
  ThumbsUp,
  TrendingUp,
  Trophy,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAdminStats } from "../hooks/useAdminStats";
import {
  type ExpiryOption,
  getReactions,
  getViewCount,
  incrementViewCount,
  toggleReaction,
} from "../hooks/useClipExtras";
import { useTrendingClips } from "../hooks/useTrendingClips";

const RANK_STYLES = [
  {
    border: "border-yellow-400/50",
    bg: "bg-yellow-400/10",
    badge: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
    glow: "shadow-yellow-400/20",
  },
  {
    border: "border-gray-300/40",
    bg: "bg-gray-300/5",
    badge: "bg-gray-300/20 text-gray-300 border-gray-300/30",
    glow: "",
  },
  {
    border: "border-orange-400/40",
    bg: "bg-orange-400/5",
    badge: "bg-orange-400/20 text-orange-300 border-orange-400/30",
    glow: "",
  },
];

const RANK_LABELS = ["🥇 1st", "🥈 2nd", "🥉 3rd"];

interface ReactionState {
  count: number;
  reacted: boolean;
}

function TrendingClipRow({
  clipId,
  title,
  index,
  scoreLabel,
  trendLabel,
}: {
  clipId: string;
  title: string;
  index: number;
  scoreLabel?: string;
  trendLabel?: string;
}) {
  const [reactions, setReactions] = useState<ReactionState>(() =>
    getReactions(clipId),
  );
  const [views, setViews] = useState(() => getViewCount(clipId));

  const rankStyle = RANK_STYLES[index] ?? {
    border: "border-white/10",
    bg: "",
    badge: "bg-white/10 text-muted-foreground border-white/10",
    glow: "",
  };
  const isTop3 = index < 3;

  const handleReact = () => {
    const next = toggleReaction(clipId);
    setReactions(next);
  };

  const handleView = () => {
    setViews(incrementViewCount(clipId));
  };

  return (
    <button
      type="button"
      className={`w-full text-left glass-card p-4 border ${rankStyle.border} ${rankStyle.bg} ${isTop3 ? `shadow-lg ${rankStyle.glow}` : ""} transition-all duration-200 hover:bg-white/8`}
      onClick={handleView}
      data-ocid={`trending.item.${index + 1}`}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${rankStyle.badge} text-sm font-bold`}
        >
          {isTop3 ? RANK_LABELS[index].split(" ")[0] : `#${index + 1}`}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold text-sm truncate">
              {title}
            </h3>
            {isTop3 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${rankStyle.badge} flex-shrink-0`}
              >
                {RANK_LABELS[index]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {scoreLabel && (
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span className="text-orange-400 font-semibold">
                  {scoreLabel}
                </span>
              </span>
            )}
            {trendLabel && (
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-indigo-400" />
                <span className="text-indigo-400 font-semibold">
                  {trendLabel}
                </span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {views}
            </span>
          </div>
        </div>

        {/* Reactions + trophy */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReact();
            }}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${
              reactions.reacted
                ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
                : "bg-white/5 border-white/10 text-muted-foreground hover:border-orange-500/30 hover:text-orange-300"
            }`}
            data-ocid="trending.toggle"
          >
            <Flame
              className={`w-3 h-3 ${reactions.reacted ? "fill-orange-400 text-orange-400" : ""}`}
            />
            {reactions.count}
          </button>
          {isTop3 && (
            <Trophy
              className={`w-5 h-5 ${
                index === 0
                  ? "text-yellow-400"
                  : index === 1
                    ? "text-gray-300"
                    : "text-orange-400"
              }`}
            />
          )}
        </div>
      </div>
    </button>
  );
}

function TopClipsLeaderboard() {
  const { data: trendingClips } = useTrendingClips();

  // Sort by local reactions
  const clipsWithReactions = (trendingClips || [])
    .map((c) => ({ ...c, reactions: getReactions(c.id).count }))
    .sort((a, b) => b.reactions - a.reactions);

  if (clipsWithReactions.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 text-center"
        data-ocid="leaderboard.empty_state"
      >
        <Crown className="w-8 h-8 text-muted-foreground/30 mb-2" />
        <p className="text-muted-foreground text-sm">No clips to rank yet</p>
        <p className="text-muted-foreground/50 text-xs mt-1">
          React to clips to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {clipsWithReactions.slice(0, 10).map((clip, index) => (
        <TrendingClipRow
          key={clip.id}
          clipId={clip.id}
          title={clip.title}
          index={index}
          scoreLabel={`${clip.reactions} 🔥`}
        />
      ))}
    </div>
  );
}

export default function TrendingPage() {
  const { trendingAnalytics, isLoading } = useAdminStats();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-white font-bold text-2xl font-display">
            Trending
          </h1>
          <p className="text-muted-foreground text-sm">
            Top performing clips by viral score & reactions
          </p>
        </div>
      </div>

      <Tabs defaultValue="leaderboard">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger
            value="leaderboard"
            className="text-sm data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
            data-ocid="trending.tab"
          >
            🏆 Leaderboard
          </TabsTrigger>
          <TabsTrigger
            value="viral"
            className="text-sm data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
            data-ocid="trending.tab"
          >
            🔥 Viral Score
          </TabsTrigger>
        </TabsList>

        {/* Leaderboard tab */}
        <TabsContent value="leaderboard" className="mt-4">
          <div className="mb-3 flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <h2 className="text-white font-semibold text-sm">
              Top Clips by Reactions
            </h2>
          </div>
          <TopClipsLeaderboard />
        </TabsContent>

        {/* Viral score tab */}
        <TabsContent value="viral" className="mt-4">
          {isLoading && (
            <div className="space-y-3">
              {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                <Skeleton key={k} className="h-20 bg-white/5 rounded-xl" />
              ))}
            </div>
          )}

          {!isLoading &&
            (!trendingAnalytics || trendingAnalytics.length === 0) && (
              <div
                className="flex flex-col items-center justify-center py-20 text-center"
                data-ocid="viral.empty_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <BarChart2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  No Trending Clips Yet
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Start creating clips to see them appear in the trending feed.
                </p>
              </div>
            )}

          {!isLoading && trendingAnalytics && trendingAnalytics.length > 0 && (
            <div className="space-y-3">
              {trendingAnalytics.map((clip, index) => (
                <TrendingClipRow
                  key={clip.id}
                  clipId={clip.id}
                  title={clip.title}
                  index={index}
                  scoreLabel={clip.scoreMetrics.toFixed(1)}
                  trendLabel={clip.trendingScore.toFixed(1)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

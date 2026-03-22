import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Eye,
  Flame,
  Medal,
  Scissors,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const CREATORS = [
  {
    rank: 1,
    name: "@beast_creator",
    clips: 234,
    views: "1.2M",
    badge: "Legend",
    xp: 12400,
    streak: 28,
  },
  {
    rank: 2,
    name: "@react_god",
    clips: 189,
    views: "987K",
    badge: "Pro",
    xp: 9800,
    streak: 21,
  },
  {
    rank: 3,
    name: "@gaming_elite",
    clips: 167,
    views: "874K",
    badge: "Pro",
    xp: 8700,
    streak: 14,
  },
  {
    rank: 4,
    name: "@vlog_queen",
    clips: 143,
    views: "721K",
    badge: "Creator",
    xp: 7200,
    streak: 10,
  },
  {
    rank: 5,
    name: "@podcastkings",
    clips: 128,
    views: "654K",
    badge: "Creator",
    xp: 6500,
    streak: 7,
  },
  {
    rank: 6,
    name: "@sports_clips",
    clips: 112,
    views: "543K",
    badge: "Creator",
    xp: 5400,
    streak: 5,
  },
  {
    rank: 7,
    name: "@cooking_lab",
    clips: 98,
    views: "421K",
    badge: "Creator",
    xp: 4200,
    streak: 3,
  },
  {
    rank: 8,
    name: "@travel_vibes",
    clips: 87,
    views: "398K",
    badge: "Creator",
    xp: 3900,
    streak: 2,
  },
  {
    rank: 9,
    name: "@techreview",
    clips: 76,
    views: "312K",
    badge: "Creator",
    xp: 3100,
    streak: 1,
  },
  {
    rank: 10,
    name: "@comedy_clips",
    clips: 65,
    views: "287K",
    badge: "Creator",
    xp: 2800,
    streak: 0,
  },
];

const badgeColor = (badge: string) => {
  if (badge === "Legend")
    return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  if (badge === "Pro")
    return "bg-purple-500/20 text-purple-300 border-purple-500/30";
  return "bg-primary/15 text-primary border-primary/30";
};

const rankIcon = (rank: number) => {
  if (rank === 1)
    return <Crown className="w-5 h-5 text-yellow-400" fill="currentColor" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
  return (
    <span className="text-sm font-black text-muted-foreground w-5 text-center">
      {rank}
    </span>
  );
};

export default function LeaderboardPage() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const myName = profile?.name
    ? `@${profile.name.toLowerCase().replace(/\s/g, "_")}`
    : "@you";
  const myRank = 47;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Top creators this month — compete for the crown
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {CREATORS.slice(0, 3).map((c) => (
          <div
            key={c.rank}
            className={`bg-white/5 border rounded-xl p-4 text-center space-y-2 ${
              c.rank === 1
                ? "border-yellow-500/40 bg-yellow-500/5"
                : c.rank === 2
                  ? "border-gray-400/30"
                  : "border-orange-400/30"
            }`}
            data-ocid={`leaderboard.item.${c.rank}`}
          >
            <div className="flex justify-center">{rankIcon(c.rank)}</div>
            <Avatar className="w-12 h-12 mx-auto ring-2 ring-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                {c.name.slice(1, 3).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white text-xs font-semibold truncate">
                {c.name}
              </p>
              <Badge className={`text-[10px] ${badgeColor(c.badge)}`}>
                {c.badge}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="text-white font-bold">{c.views}</p>
              <p>views</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-white font-bold text-lg">4,821</p>
          <p className="text-muted-foreground text-xs">Active Creators</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <Scissors className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-white font-bold text-lg">128K</p>
          <p className="text-muted-foreground text-xs">Clips This Month</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <Eye className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-white font-bold text-lg">89M</p>
          <p className="text-muted-foreground text-xs">Total Views</p>
        </div>
      </div>

      {/* Full leaderboard */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/8">
          <h2 className="text-white font-bold text-sm">
            Top 10 Creators This Month
          </h2>
        </div>
        <div className="divide-y divide-white/5">
          {CREATORS.map((c) => (
            <div
              key={c.rank}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors"
              data-ocid={`leaderboard.row.${c.rank}`}
            >
              <div className="flex items-center justify-center w-6 flex-shrink-0">
                {rankIcon(c.rank)}
              </div>
              <Avatar className="w-8 h-8 ring-1 ring-primary/20 flex-shrink-0">
                <AvatarFallback className="bg-primary/15 text-primary text-xs">
                  {c.name.slice(1, 3).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-medium">{c.name}</p>
                  <Badge className={`text-[10px] ${badgeColor(c.badge)}`}>
                    {c.badge}
                  </Badge>
                  {c.streak > 0 && (
                    <span className="flex items-center gap-0.5 text-orange-400 text-[10px]">
                      <Flame className="w-2.5 h-2.5" fill="currentColor" />
                      {c.streak}d
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">{c.clips} clips</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white text-sm font-bold">{c.views}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Star className="w-2.5 h-2.5 text-yellow-400" />
                  {c.xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Rank */}
      {identity && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Your Rank</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-primary">#{myRank}</span>
            <Avatar className="w-8 h-8 ring-1 ring-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {myName.slice(1, 3).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{myName}</p>
              <p className="text-muted-foreground text-xs">
                Keep creating to climb the ranks!
              </p>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-sm">+3 this week</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground/50 pb-4 flex items-center justify-center gap-1">
        Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}

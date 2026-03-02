import React from 'react';
import { useAdminStats } from '../hooks/useAdminStats';
import { useTrendingClips } from '../hooks/useTrendingClips';
import { TrendingUp, Zap, Flame } from 'lucide-react';
import ClipCard from '../components/ClipCard';

export default function TrendingPage() {
  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const { data: trendingClips = [], isLoading: clipsLoading } = useTrendingClips();
  const trendingAnalytics = statsData?.trendingAnalytics ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Flame className="w-8 h-8 text-cyan-neon" />
          <div>
            <h1 className="font-orbitron text-xl text-cyan-neon">TRENDING</h1>
            <p className="text-muted-foreground text-sm">Top clips by viral score</p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      {trendingAnalytics.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-cyan-neon/20">
          <h2 className="font-orbitron text-xs text-cyan-neon mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            TOP PERFORMERS
          </h2>
          <div className="space-y-2">
            {trendingAnalytics.slice(0, 5).map((clip, i) => (
              <div
                key={clip.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-cyan-neon/5 border border-cyan-neon/10"
              >
                <span className="font-orbitron text-sm text-cyan-neon/50 w-6 shrink-0">#{i + 1}</span>
                <p className="text-sm text-foreground flex-1 truncate">{clip.title}</p>
                <span className="flex items-center gap-1 text-xs font-orbitron text-cyan-neon shrink-0">
                  <Zap className="w-3 h-3" />
                  {clip.trendingScore.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clips Grid */}
      <div>
        <h2 className="font-orbitron text-xs text-cyan-neon mb-4">HOT CLIPS</h2>
        {clipsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : trendingClips.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Flame className="w-12 h-12 text-cyan-neon/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">No clips yet. Create some clips to see them trending!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingClips.map((clip) => (
              <ClipCard key={clip.id} clip={clip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { useAdminStats } from '../hooks/useAdminStats';
import { TrendingUp, Zap } from 'lucide-react';

export default function TrendingSidebar() {
  const { data, isLoading } = useAdminStats();
  const trendingAnalytics = data?.trendingAnalytics ?? [];

  return (
    <div className="glass-card rounded-2xl p-4 border border-cyan-neon/20">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-cyan-neon" />
        <h3 className="font-orbitron text-xs text-cyan-neon">TRENDING</h3>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-cyan-neon/5 animate-pulse" />
          ))}
        </div>
      ) : trendingAnalytics.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No trending clips yet</p>
      ) : (
        <div className="space-y-2">
          {trendingAnalytics.slice(0, 5).map((clip, i) => (
            <div
              key={clip.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-cyan-neon/5 transition-smooth"
            >
              <span className="font-orbitron text-xs text-cyan-neon/50 w-4 shrink-0">#{i + 1}</span>
              <p className="text-xs text-foreground truncate flex-1">{clip.title}</p>
              <span className="flex items-center gap-0.5 text-xs text-cyan-neon shrink-0">
                <Zap className="w-2.5 h-2.5" />
                {clip.trendingScore.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

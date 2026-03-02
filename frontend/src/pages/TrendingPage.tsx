import React from 'react';
import { useTrendingClips } from '../hooks/useTrendingClips';
import { useAdminStats } from '../hooks/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Zap, Trophy } from 'lucide-react';

export default function TrendingPage() {
  const { data: trendingClips = [], isLoading: clipsLoading } = useTrendingClips();
  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const trendingAnalytics = statsData?.trendingAnalytics ?? [];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <TrendingUp size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trending Now</h1>
          <p className="text-sm text-muted-foreground">Top viral clips ranked by score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main trending grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            Hot Clips
          </h2>
          {clipsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : trendingClips.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border/50">
              <TrendingUp size={48} className="mx-auto mb-3 opacity-30" />
              <p>No trending clips yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingClips.map((clip, index) => (
                <div
                  key={clip.id}
                  className="bg-card rounded-xl border border-border/50 p-4 hover:border-primary/40 transition-all duration-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {clip.title || 'Untitled'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {Math.floor(clip.startTime / 60)}:
                        {String(clip.startTime % 60).padStart(2, '0')} –{' '}
                        {Math.floor(clip.endTime / 60)}:
                        {String(clip.endTime % 60).padStart(2, '0')}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${
                        (clip.score || 0) >= 80
                          ? 'bg-green-500/20 text-green-400'
                          : (clip.score || 0) >= 50
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      {(clip.score || 0).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Trophy size={18} className="text-yellow-400" />
            Top 5 Leaderboard
          </h2>
          <div className="bg-card rounded-xl border border-border/50 p-4 space-y-3">
            {statsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : trendingAnalytics.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Trophy size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No data yet</p>
              </div>
            ) : (
              trendingAnalytics.slice(0, 5).map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-background/50"
                >
                  <span
                    className={`text-sm font-bold w-6 text-center ${
                      index === 0
                        ? 'text-yellow-400'
                        : index === 1
                        ? 'text-gray-300'
                        : index === 2
                        ? 'text-amber-600'
                        : 'text-muted-foreground'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Score: {(item.trendingScore || item.scoreMetrics || 0).toFixed(1)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { TrendingUp, Flame, Trophy, Loader2, BarChart2 } from 'lucide-react';
import { useAdminStats } from '../hooks/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';

const RANK_STYLES = [
  { border: 'border-yellow-400/50', bg: 'bg-yellow-400/10', badge: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40', glow: 'shadow-yellow-400/20' },
  { border: 'border-gray-300/40', bg: 'bg-gray-300/5', badge: 'bg-gray-300/20 text-gray-300 border-gray-300/30', glow: '' },
  { border: 'border-orange-400/40', bg: 'bg-orange-400/5', badge: 'bg-orange-400/20 text-orange-300 border-orange-400/30', glow: '' },
];

const RANK_LABELS = ['🥇 1st', '🥈 2nd', '🥉 3rd'];

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
          <h1 className="text-white font-bold text-2xl font-display">Trending in Niche</h1>
          <p className="text-muted-foreground text-sm">Top performing clips by viral score</p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 bg-white/5 rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!trendingAnalytics || trendingAnalytics.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <BarChart2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No Trending Clips Yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Start creating clips to see them appear in the trending feed.
          </p>
        </div>
      )}

      {/* Trending List */}
      {!isLoading && trendingAnalytics && trendingAnalytics.length > 0 && (
        <div className="space-y-3">
          {trendingAnalytics.map((clip, index) => {
            const rankStyle = RANK_STYLES[index] || {
              border: 'border-white/10',
              bg: '',
              badge: 'bg-white/10 text-muted-foreground border-white/10',
              glow: '',
            };
            const isTop3 = index < 3;

            return (
              <div
                key={clip.id}
                className={`glass-card p-4 border ${rankStyle.border} ${rankStyle.bg} ${isTop3 ? `shadow-lg ${rankStyle.glow}` : ''} transition-all duration-200 hover:bg-white/8`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${rankStyle.badge} text-sm font-bold`}>
                    {isTop3 ? RANK_LABELS[index].split(' ')[0] : `#${index + 1}`}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm truncate">{clip.title}</h3>
                      {isTop3 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${rankStyle.badge} flex-shrink-0`}>
                          {RANK_LABELS[index]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        Score: <span className="text-orange-400 font-semibold">{clip.scoreMetrics.toFixed(1)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-indigo-400" />
                        Trend: <span className="text-indigo-400 font-semibold">{clip.trendingScore.toFixed(1)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Trophy for top 3 */}
                  {isTop3 && (
                    <Trophy className={`w-5 h-5 flex-shrink-0 ${
                      index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'
                    }`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

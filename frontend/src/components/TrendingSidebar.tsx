import React from 'react';
import { useAdminStats } from '../hooks/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Trophy } from 'lucide-react';

export default function TrendingSidebar() {
  const { data, isLoading } = useAdminStats();
  const trendingAnalytics = data?.trendingAnalytics ?? [];

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
        <Trophy size={16} className="text-yellow-400" />
        Top Trending
      </h3>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      ) : trendingAnalytics.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          <TrendingUp size={24} className="mx-auto mb-1 opacity-30" />
          <p className="text-xs">No trending clips</p>
        </div>
      ) : (
        <div className="space-y-2">
          {trendingAnalytics.slice(0, 5).map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-background/50"
            >
              <span
                className={`text-xs font-bold w-5 text-center ${
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
                <p className="text-[10px] text-muted-foreground">
                  {(item.trendingScore || item.scoreMetrics || 0).toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { useAdminStats } from '../hooks/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2, Scissors, TrendingUp } from 'lucide-react';

export default function AppAnalytics() {
  const { data, isLoading } = useAdminStats();
  const totalClips = data?.totalClips ?? 0;
  const trendingAnalytics = data?.trendingAnalytics ?? [];

  const chartData = trendingAnalytics.slice(0, 8).map((item, i) => ({
    name: item.title?.slice(0, 8) || `Clip ${i + 1}`,
    score: Number((item.trendingScore || item.scoreMetrics || 0).toFixed(1)),
  }));

  return (
    <div className="bg-card rounded-lg border border-border/50 p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background/50 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <Scissors size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">Total Clips</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p className="text-2xl font-bold text-foreground">{totalClips}</p>
          )}
        </div>
        <div className="bg-background/50 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-accent" />
            <span className="text-xs text-muted-foreground">Trending</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p className="text-2xl font-bold text-foreground">{trendingAnalytics.length}</p>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <BarChart2 size={12} />
            Top Clip Scores
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#888' }} />
              <YAxis tick={{ fontSize: 9, fill: '#888' }} />
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="score" fill="oklch(0.65 0.25 320)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

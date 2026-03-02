import React from 'react';
import { useAdminStats } from '../hooks/useAdminStats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Scissors, Activity } from 'lucide-react';

export default function AppAnalytics() {
  const { data, isLoading } = useAdminStats();

  const totalClips = data?.totalClips ?? 0;
  const chartData = data?.videoUploadStats?.map((s) => ({
    hour: `${s.hour}h`,
    count: s.count,
  })) ?? [];

  return (
    <div className="glass-card rounded-2xl p-6 border border-cyan-neon/20 space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-neon" />
        <h3 className="font-orbitron text-sm text-cyan-neon">ANALYTICS</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-4 text-center">
          <Scissors className="w-5 h-5 text-cyan-neon mx-auto mb-1" />
          <p className="font-orbitron text-2xl text-cyan-neon">{isLoading ? '...' : totalClips}</p>
          <p className="text-xs text-muted-foreground">Total Clips</p>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center">
          <TrendingUp className="w-5 h-5 text-cyan-neon mx-auto mb-1" />
          <p className="font-orbitron text-2xl text-cyan-neon">
            {isLoading ? '...' : data?.trendingAnalytics?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Trending</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-3">Activity (last 24h)</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData}>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'rgba(0,242,255,0.5)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(0,242,255,0.5)' }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(36,0,70,0.9)',
                  border: '1px solid rgba(0,242,255,0.3)',
                  borderRadius: '8px',
                  color: '#00f2ff',
                }}
              />
              <Bar dataKey="count" fill="#00f2ff" opacity={0.7} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

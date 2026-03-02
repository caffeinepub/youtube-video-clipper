import React, { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useQuery } from '@tanstack/react-query';
import { generateShortUserId } from '../utils/userIdGenerator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, Activity } from 'lucide-react';

export default function ActivityLogTable() {
  const { actor, isFetching: actorFetching } = useActor();
  const [search, setSearch] = useState('');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).getActivityLogs?.();
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30_000,
  });

  const formatTime = (ts: bigint | number) => {
    const ms = typeof ts === 'bigint' ? Number(ts) / 1_000_000 : Number(ts);
    const date = new Date(ms);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredLogs = logs.filter((log: any) => {
    if (!search) return true;
    const shortId = log.userPrincipal ? generateShortUserId(log.userPrincipal) : '';
    return (
      shortId.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.userPrincipal?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-card rounded-lg border border-border/50 p-4 space-y-3">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logs..."
          className="pl-8 bg-background border-border text-foreground text-sm h-8"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 rounded-lg" />)}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <Activity size={24} className="mx-auto mb-1 opacity-30" />
          <p className="text-xs">{search ? 'No matching logs' : 'No activity logs yet'}</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {filteredLogs.map((log: any) => {
            const shortId = log.userPrincipal ? generateShortUserId(log.userPrincipal) : 'unknown';
            return (
              <div key={log.id} className="flex items-center gap-3 p-2 rounded bg-background/50 border border-border/20 text-xs">
                <span className="font-mono text-primary shrink-0">{shortId}</span>
                <span className="text-foreground flex-1 truncate">{log.action}</span>
                <span className="text-muted-foreground shrink-0">{formatTime(log.timestamp)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

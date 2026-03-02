import React, { useState } from 'react';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { generateShortUserId } from '../utils/userIdGenerator';
import { Search, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityLogTable() {
  const { data: logs = [], isLoading } = useActivityLogs();
  const [search, setSearch] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.userPrincipal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logs..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-cyan-neon/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No activity logs yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-cyan-neon/5 border border-cyan-neon/10 text-sm"
            >
              <span className="text-xs text-muted-foreground font-mono shrink-0">
                #{generateShortUserId(log.userPrincipal)}
              </span>
              <span className="text-foreground flex-1">{log.action}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(Number(log.timestamp) / 1_000_000), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

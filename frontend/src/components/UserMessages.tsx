import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { useMyMessages } from '../hooks/useMyMessages';
import { Skeleton } from '@/components/ui/skeleton';
import { generateShortUserId } from '../utils/userIdGenerator';

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function UserMessages() {
  const { data: messages, isLoading } = useMyMessages();

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white font-display">Messages</h3>
        </div>
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <MessageSquare size={16} className="text-indigo-400" />
        <h3 className="text-sm font-semibold text-white font-display">Messages</h3>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium">
          {messages.length}
        </span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-indigo-300">
                From Admin · {generateShortUserId(msg.fromPrincipal)}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock size={10} />
                <span>{formatDate(msg.sentAt)}</span>
              </div>
            </div>
            <p className="text-sm text-white/90">{msg.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

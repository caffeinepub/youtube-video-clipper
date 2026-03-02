import React from 'react';
import { useSocialFeed } from '../hooks/useSocialFeed';
import { Skeleton } from '@/components/ui/skeleton';
import { Rss, Scissors, Clock } from 'lucide-react';

export default function SocialFeedPage() {
  const { data: feedItems = [], isLoading } = useSocialFeed();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Rss size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Social Feed</h1>
          <p className="text-sm text-muted-foreground">Recent clip activity from all creators</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : feedItems.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border/50">
          <Rss size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No activity yet</p>
          <p className="text-sm mt-1">Clips created by users will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item: any) => (
            <div
              key={item.id}
              className="bg-card rounded-xl border border-border/50 p-4 hover:border-primary/30 transition-all duration-200 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {item.userInitial || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary">{item.userId || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">created a clip</span>
                    <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                      <Clock size={10} />
                      {item.timeAgo}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-background/50 rounded-lg p-2 border border-border/30">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center shrink-0">
                      <Scissors size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.clipTitle || 'Untitled Clip'}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.timeRange}
                      </p>
                    </div>
                    {item.score !== undefined && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                        item.score >= 80 ? 'bg-green-500/20 text-green-400' :
                        item.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-muted/50 text-muted-foreground'
                      }`}>
                        {item.score.toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

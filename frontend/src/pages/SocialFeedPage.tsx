import React from 'react';
import { Users, Clock, Scissors } from 'lucide-react';
import { useSocialFeed } from '../hooks/useSocialFeed';
import { formatDistanceToNow } from 'date-fns';
import { generateShortUserId } from '../utils/userIdGenerator';

export default function SocialFeedPage() {
  const { feedItems, isLoading } = useSocialFeed();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-cyan-neon" />
          <div>
            <h1 className="font-orbitron text-xl text-cyan-neon">SOCIAL FEED</h1>
            <p className="text-muted-foreground text-sm">Recent clip activity from all players</p>
          </div>
        </div>
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-neon/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-cyan-neon/10 rounded w-1/3" />
                  <div className="h-3 bg-cyan-neon/5 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : feedItems.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Scissors className="w-12 h-12 text-cyan-neon/30 mx-auto mb-4" />
          <h3 className="font-orbitron text-sm text-muted-foreground">NO ACTIVITY YET</h3>
          <p className="text-muted-foreground text-sm mt-2">Be the first to create a clip!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-4 border border-cyan-neon/10 hover:border-cyan-neon/30 transition-smooth animate-fade-in-up"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-center shrink-0">
                  <span className="font-orbitron text-xs text-cyan-neon">
                    {item.userName.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">{item.userName}</span>
                    <span className="text-muted-foreground text-xs">created a clip</span>
                    <span className="text-xs text-cyan-neon/60 font-mono">#{generateShortUserId(item.principal)}</span>
                  </div>

                  {/* Clip Info */}
                  <div className="mt-2 p-3 rounded-xl bg-cyan-neon/5 border border-cyan-neon/10">
                    <div className="flex items-center gap-2">
                      {item.thumbnailUrl && (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-16 h-10 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.startTime}s – {item.endTime}s
                          </span>
                          <span
                            className={`text-xs font-orbitron px-2 py-0.5 rounded-full border ${
                              item.score >= 80
                                ? 'text-cyan-neon border-cyan-neon/40 bg-cyan-neon/10'
                                : 'text-muted-foreground border-muted/30'
                            }`}
                          >
                            ⚡ {item.score.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

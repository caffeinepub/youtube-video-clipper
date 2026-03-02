import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useClips } from '../hooks/useClips';
import { User, Scissors, TrendingUp, Calendar, Star, LogIn } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { generateShortUserId } from '../utils/userIdGenerator';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: clips = [], isLoading: clipsLoading } = useClips();

  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="glass-card rounded-2xl p-8 text-center max-w-sm">
          <LogIn className="w-12 h-12 text-cyan-neon mx-auto mb-4" />
          <h2 className="font-orbitron text-lg text-cyan-neon mb-2">LOGIN REQUIRED</h2>
          <p className="text-muted-foreground text-sm">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  const principal = identity.getPrincipal().toString();
  const shortId = generateShortUserId(principal);
  const totalScore = clips.reduce((sum, c) => sum + (c.score || 0), 0);
  const avgScore = clips.length > 0 ? totalScore / clips.length : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-cyan-neon/10 border-2 border-cyan-neon/40 flex items-center justify-center neon-glow-sm">
            <User className="w-10 h-10 text-cyan-neon" />
          </div>
          <div className="flex-1">
            <h1 className="font-orbitron text-2xl text-cyan-neon">
              {profileLoading ? '...' : userProfile?.name || 'Anonymous Player'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">ID: {shortId}</p>
            <p className="text-muted-foreground text-xs mt-0.5 font-mono truncate max-w-xs">{principal}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="glass-panel rounded-xl p-4 text-center">
            <Scissors className="w-6 h-6 text-cyan-neon mx-auto mb-2" />
            <p className="font-orbitron text-2xl text-cyan-neon">{clips.length}</p>
            <p className="text-xs text-muted-foreground">Total Clips</p>
          </div>
          <div className="glass-panel rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-cyan-neon mx-auto mb-2" />
            <p className="font-orbitron text-2xl text-cyan-neon">{avgScore.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
          <div className="glass-panel rounded-xl p-4 text-center">
            <Star className="w-6 h-6 text-cyan-neon mx-auto mb-2" />
            <p className="font-orbitron text-2xl text-cyan-neon">
              {clips.filter((c) => (c.score || 0) >= 80).length}
            </p>
            <p className="text-xs text-muted-foreground">Viral Clips</p>
          </div>
        </div>
      </div>

      {/* Activity History */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-orbitron text-sm text-cyan-neon mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          CLIP ACTIVITY
        </h2>

        {clipsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-cyan-neon/5 animate-pulse" />
            ))}
          </div>
        ) : clips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Scissors className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No clips yet. Start clipping!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-cyber">
            {[...clips]
              .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
              .map((clip) => (
                <div
                  key={clip.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-cyan-neon/5 border border-cyan-neon/10 hover:border-cyan-neon/30 transition-smooth"
                >
                  <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 bg-purple-deep">
                    {clip.thumbnailUrl && (
                      <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{clip.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(Number(clip.createdAt) / 1_000_000), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={`text-xs font-orbitron px-2 py-1 rounded-full border ${
                        (clip.score || 0) >= 80
                          ? 'text-cyan-neon border-cyan-neon/40 bg-cyan-neon/10'
                          : 'text-muted-foreground border-muted/30 bg-muted/10'
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
    </div>
  );
}

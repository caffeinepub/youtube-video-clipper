import React from 'react';
import { Sparkles, Star, Clock, LogIn } from 'lucide-react';
import { useMintedCollectibles } from '../hooks/useMintedCollectibles';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { formatDistanceToNow } from 'date-fns';

export default function MyGalleryPage() {
  const { identity } = useInternetIdentity();
  const { collectibles, isLoading } = useMintedCollectibles();

  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="glass-card rounded-2xl p-8 text-center max-w-sm">
          <LogIn className="w-12 h-12 text-cyan-neon mx-auto mb-4" />
          <h2 className="font-orbitron text-lg text-cyan-neon mb-2">LOGIN REQUIRED</h2>
          <p className="text-muted-foreground text-sm">Please login to view your gallery.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-cyan-neon animate-mint-sparkle" />
          <div>
            <h1 className="font-orbitron text-xl text-cyan-neon">MY GALLERY</h1>
            <p className="text-muted-foreground text-sm">Your minted digital collectibles on ICP</p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-4 animate-pulse h-48" />
          ))}
        </div>
      ) : collectibles.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Sparkles className="w-12 h-12 text-cyan-neon/30 mx-auto mb-4" />
          <h3 className="font-orbitron text-sm text-muted-foreground">NO COLLECTIBLES YET</h3>
          <p className="text-muted-foreground text-sm mt-2">
            Mint your best clips to save them as permanent digital collectibles!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectibles.map((item) => (
            <div
              key={item.clipId}
              className="glass-card rounded-2xl overflow-hidden border border-cyan-neon/20 hover:border-cyan-neon/50 transition-smooth group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-purple-deep">
                {item.thumbnailUrl && (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span className="flex items-center gap-1 text-xs font-orbitron px-2 py-1 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 text-cyan-neon neon-glow-sm">
                    <Sparkles className="w-3 h-3" />
                    MINTED ✓
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.startTime}s – {item.endTime}s
                  </span>
                  <span className="text-xs font-orbitron text-cyan-neon">
                    ⚡ {item.viralScore.toFixed(0)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Star className="w-3 h-3 text-cyan-neon" />
                  Minted {formatDistanceToNow(new Date(item.mintedAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

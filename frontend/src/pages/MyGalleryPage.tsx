import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useClips } from '../hooks/useClips';
import { Skeleton } from '@/components/ui/skeleton';
import { Image, Scissors, LogIn, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MyGalleryPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: clips = [], isLoading } = useClips();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <Image size={64} className="text-muted-foreground/30" />
        <h2 className="text-xl font-semibold text-foreground">Sign in to view your gallery</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Connect with Internet Identity to access your clip gallery.
        </p>
        <Button
          onClick={() => login()}
          disabled={loginStatus === 'logging-in'}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <LogIn size={16} className="mr-2" />
          {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    );
  }

  const viralClips = clips.filter(c => (c.score || 0) >= 70);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Image size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Gallery</h1>
          <p className="text-sm text-muted-foreground">Your top-performing clip collectibles</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : viralClips.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border/50">
          <Zap size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No viral clips yet</p>
          <p className="text-sm mt-1">Clips with a score of 70+ will appear here as collectibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {viralClips.map((clip) => (
            <div
              key={clip.id}
              className="bg-card rounded-xl border border-border/50 p-4 hover:border-primary/40 transition-all duration-200 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
              {/* Thumbnail placeholder */}
              <div className="w-full h-32 bg-primary/10 rounded-lg mb-3 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                <Scissors size={32} className="text-primary/40" />
              </div>
              <h3 className="text-sm font-semibold text-foreground truncate mb-1">{clip.title || 'Untitled Clip'}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {Math.floor(clip.startTime / 60)}:{String(clip.startTime % 60).padStart(2, '0')} –{' '}
                {Math.floor(clip.endTime / 60)}:{String(clip.endTime % 60).padStart(2, '0')}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Viral Score</span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                  (clip.score || 0) >= 90 ? 'bg-green-500/20 text-green-400' :
                  (clip.score || 0) >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-primary/20 text-primary'
                }`}>
                  {(clip.score || 0).toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useClips } from '../hooks/useClips';
import { useGetOwnRole } from '../hooks/useGetOwnRole';
import { generateShortUserId } from '../utils/userIdGenerator';
import UserRoleBadge from '../components/UserRoleBadge';
import UserIdDisplay from '../components/UserIdDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Scissors, TrendingUp, Zap, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity as useII } from '../hooks/useInternetIdentity';

export default function ProfilePage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: clips = [], isLoading: clipsLoading } = useClips();
  const { data: role } = useGetOwnRole();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <User size={64} className="text-muted-foreground/30" />
        <h2 className="text-xl font-semibold text-foreground">Sign in to view your profile</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Connect with Internet Identity to access your profile, clips, and stats.
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

  const principal = identity.getPrincipal().toString();
  const shortId = generateShortUserId(principal);
  const totalClips = clips.length;
  const avgScore = clips.length > 0
    ? (clips.reduce((sum, c) => sum + (c.score || 0), 0) / clips.length).toFixed(1)
    : '0.0';
  const viralClips = clips.filter(c => (c.score || 0) >= 80).length;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-card rounded-xl border border-border/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shrink-0">
          {profileLoading ? (
            <Skeleton className="w-20 h-20 rounded-full" />
          ) : (
            <span className="text-3xl font-bold text-primary">
              {userProfile?.name ? userProfile.name[0].toUpperCase() : '?'}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {profileLoading ? (
            <Skeleton className="h-7 w-40 mb-2" />
          ) : (
            <h1 className="text-2xl font-bold text-foreground">{userProfile?.name || 'Unknown User'}</h1>
          )}
          {role && <UserRoleBadge role={role} />}
          <div className="mt-2">
            <UserIdDisplay />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Scissors size={24} className="text-primary" />
          </div>
          {clipsLoading ? (
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
          ) : (
            <p className="text-2xl font-bold text-foreground">{totalClips}</p>
          )}
          <p className="text-xs text-muted-foreground">Total Clips</p>
        </div>
        <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp size={24} className="text-accent" />
          </div>
          {clipsLoading ? (
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
          ) : (
            <p className="text-2xl font-bold text-foreground">{avgScore}</p>
          )}
          <p className="text-xs text-muted-foreground">Avg Score</p>
        </div>
        <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap size={24} className="text-yellow-400" />
          </div>
          {clipsLoading ? (
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
          ) : (
            <p className="text-2xl font-bold text-foreground">{viralClips}</p>
          )}
          <p className="text-xs text-muted-foreground">Viral Clips</p>
        </div>
      </div>

      {/* Clip Activity */}
      <div className="bg-card rounded-xl border border-border/50 p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Scissors size={18} className="text-primary" />
          Clip Activity
        </h2>
        {clipsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
          </div>
        ) : clips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Scissors size={32} className="mx-auto mb-2 opacity-30" />
            <p>No clips yet. Start creating!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...clips].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).map(clip => (
              <div key={clip.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/30">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Scissors size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{clip.title || 'Untitled Clip'}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(clip.startTime / 60)}:{String(clip.startTime % 60).padStart(2, '0')} –{' '}
                    {Math.floor(clip.endTime / 60)}:{String(clip.endTime % 60).padStart(2, '0')}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    (clip.score || 0) >= 80 ? 'bg-green-500/20 text-green-400' :
                    (clip.score || 0) >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-muted/50 text-muted-foreground'
                  }`}>
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

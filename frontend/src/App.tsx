import React, { useState } from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import AppShell from './components/AppShell';
import ProfileSetup from './components/ProfileSetup';
import AccountStatusGuard from './components/AccountStatusGuard';
import VideoUrlForm from './components/VideoUrlForm';
import YouTubePlayer from './components/YouTubePlayer';
import ClipTimestampControls from './components/ClipTimestampControls';
import ClipList from './components/ClipList';
import ClipSuggestions from './components/ClipSuggestions';
import VerticalClipPreview from './components/VerticalClipPreview';
import CaptionEditor from './components/CaptionEditor';
import TrendingSidebar from './components/TrendingSidebar';
import AdminPanel from './components/AdminPanel';
import TrendingPage from './pages/TrendingPage';
import Scheduler from './pages/Scheduler';
import ContentManager from './pages/ContentManager';
import OAuthCallback from './pages/OAuthCallback';
import UserMessages from './components/UserMessages';
import ChannelConnection from './components/ChannelConnection';
import FeedbackModal from './components/FeedbackModal';
import { useClips } from './hooks/useClips';
import { VideoClip } from './backend';
import { Heart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
    },
  },
});

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center indigo-glow">
            <img
              src="/assets/generated/beast-clipping-logo.dim_320x80.png"
              alt="Beast Clipping"
              className="w-10 h-10 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-3xl font-display">Beast Clipping</h1>
            <p className="text-indigo-400 text-sm mt-1">Premium clip management dashboard</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-white font-semibold text-lg">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Sign in to access your dashboard</p>
          </div>

          <button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full py-3 px-6 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed indigo-glow flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-muted-foreground text-xs">
            Secure authentication powered by Internet Identity
          </p>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground/50 text-xs flex items-center justify-center gap-1">
          Built with <Heart className="w-3 h-3 text-indigo-400 fill-indigo-400" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [suggestedStart, setSuggestedStart] = useState<number | undefined>();
  const [suggestedEnd, setSuggestedEnd] = useState<number | undefined>();
  const [suggestedTitle, setSuggestedTitle] = useState<string | undefined>();
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [caption, setCaption] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<import('./backend').AutoGeneratedClipSuggestion[]>([]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { data: clips } = useClips();

  const handleVideoLoad = (url: string, id: string) => {
    setVideoUrl(url);
    setVideoId(id);
    setAiSuggestions([]);
  };

  const handleSuggestionSelect = (start: number, end: number, title: string) => {
    setSuggestedStart(start);
    setSuggestedEnd(end);
    setSuggestedTitle(title);
  };

  const handleClipSaved = () => {
    // React Query handles cache invalidation
  };

  const previewClip = selectedClip || (clips && clips.length > 0 ? clips[clips.length - 1] : null);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-2xl font-display">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Create and manage your viral clips</p>
        </div>
        <div className="flex items-center gap-2">
          <ChannelConnection />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFeedbackOpen(true)}
            className="text-muted-foreground hover:text-white"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video URL Form */}
          <div className="glass-card p-4">
            <VideoUrlForm
              onSubmit={handleVideoLoad}
              onClipsGenerated={setAiSuggestions}
            />
          </div>

          {/* YouTube Player */}
          {videoId && (
            <div className="glass-card p-4">
              <YouTubePlayer videoId={videoId} />
            </div>
          )}

          {/* Clip Suggestions */}
          {videoId && (
            <ClipSuggestions
              onSelectSuggestion={handleSuggestionSelect}
              aiSuggestions={aiSuggestions}
            />
          )}

          {/* Clip Timestamp Controls */}
          {videoId && (
            <div className="glass-card p-4">
              <ClipTimestampControls
                videoId={videoId}
                videoUrl={videoUrl}
                suggestedStartTime={suggestedStart}
                suggestedEndTime={suggestedEnd}
                suggestedTitle={suggestedTitle}
                onClipSaved={handleClipSaved}
              />
            </div>
          )}

          {/* Caption Editor */}
          <CaptionEditor
            initialCaption={caption}
            onCaptionChange={setCaption}
          />

          {/* Clip List */}
          <div className="glass-card p-4">
            <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              My Clips
              {clips && clips.length > 0 && (
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">
                  {clips.length}
                </span>
              )}
            </h2>
            <ClipList onClipSelect={setSelectedClip} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <h2 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              Clip Preview
              <span className="text-muted-foreground text-xs font-normal">9:16</span>
            </h2>
            <VerticalClipPreview clip={previewClip} />
          </div>
          <TrendingSidebar />
          <UserMessages />
        </div>
      </div>
    </div>
  );
}

// ─── Clips Page ───────────────────────────────────────────────────────────────

function ClipsPage() {
  const { data: clips } = useClips();
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <span className="text-indigo-400 text-lg">✂️</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-2xl font-display">My Clips</h1>
          <p className="text-muted-foreground text-sm">{clips?.length || 0} clips saved</p>
        </div>
      </div>
      <div className="glass-card p-4">
        <ClipList />
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

function AdminPage() {
  return (
    <div className="p-4 md:p-6">
      <AdminPanel />
    </div>
  );
}

// ─── App Layout ───────────────────────────────────────────────────────────────

function AppLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <AccountStatusGuard>
      <AppShell>
        {showProfileSetup && <ProfileSetup />}
        <Outlet />
      </AppShell>
    </AccountStatusGuard>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: AppLayout });

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const clipsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/clips', component: ClipsPage });
const trendingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/trending', component: TrendingPage });
const schedulerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/scheduler', component: Scheduler });
const contentManagerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/content-manager', component: ContentManager });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminPage });
const oauthCallbackRoute = createRoute({ getParentRoute: () => rootRoute, path: '/oauth/callback', component: OAuthCallback });

const routeTree = rootRoute.addChildren([
  homeRoute,
  clipsRoute,
  trendingRoute,
  schedulerRoute,
  contentManagerRoute,
  adminRoute,
  oauthCallbackRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: 'oklch(0.12 0.015 264)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'oklch(0.95 0.01 264)',
          },
        }}
      />
    </QueryClientProvider>
  );
}

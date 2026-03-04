import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Clock, Heart, MessageSquare, Youtube } from "lucide-react";
import React, { useState } from "react";
import { SystemStatus, type VideoClip } from "./backend";
import AccountStatusGuard from "./components/AccountStatusGuard";
import AdminPanel from "./components/AdminPanel";
import AppShell from "./components/AppShell";
import CaptionEditor from "./components/CaptionEditor";
import ChannelConnection from "./components/ChannelConnection";
import ClipList from "./components/ClipList";
import ClipQueue from "./components/ClipQueue";
import ClipSuggestions from "./components/ClipSuggestions";
import ClipTimestampControls from "./components/ClipTimestampControls";
import FeedbackModal from "./components/FeedbackModal";
import MemeOverlayLibrary from "./components/MemeOverlayLibrary";
import PausedScreen from "./components/PausedScreen";
import PinnedLinks from "./components/PinnedLinks";
import ProfileSetup from "./components/ProfileSetup";
import TranscriptPanel from "./components/TranscriptPanel";
import TrendingSidebar from "./components/TrendingSidebar";
import UserMessages from "./components/UserMessages";
import VerticalClipPreview from "./components/VerticalClipPreview";
import VideoUrlForm from "./components/VideoUrlForm";
import YouTubePlayer from "./components/YouTubePlayer";
import { useActor } from "./hooks/useActor";
import { useClips } from "./hooks/useClips";
import { useGetOwnRole } from "./hooks/useGetOwnRole";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import { useSystemStatus } from "./hooks/useSystemStatus";
import ContentManager from "./pages/ContentManager";
import MessagesPage from "./pages/MessagesPage";
import OAuthCallback from "./pages/OAuthCallback";
import ProfilePage from "./pages/ProfilePage";
import Scheduler from "./pages/Scheduler";
import TrendingPage from "./pages/TrendingPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
    },
  },
});

// ─── Social Feed Mini Card ────────────────────────────────────────────────────

function timeAgo(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function SocialFeed() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: allClips = [] } = useQuery<VideoClip[]>({
    queryKey: ["allClips", ""],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClips("");
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });

  const recentClips = [...allClips]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  if (recentClips.length === 0) return null;

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="text-white font-semibold text-sm">Recent Activity</h3>
        <span className="text-xs text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
          Live
        </span>
      </div>
      <div className="space-y-2">
        {recentClips.map((clip) => {
          let videoId = "";
          try {
            const u = new URL(clip.videoUrl);
            videoId =
              u.searchParams.get("v") || u.pathname.split("/").pop() || "";
          } catch {
            videoId = clip.videoUrl;
          }
          const thumb =
            clip.thumbnailUrl ||
            (videoId
              ? `https://img.youtube.com/vi/${videoId}/default.jpg`
              : "");

          return (
            <div
              key={clip.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/3 border border-white/5 hover:bg-white/5 transition-colors"
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt={clip.title}
                  className="w-10 h-7 object-cover rounded flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-7 bg-white/5 rounded flex items-center justify-center flex-shrink-0">
                  <Youtube className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  {clip.title}
                </p>
                <p className="text-muted-foreground text-[10px]">
                  {timeAgo(clip.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cyberpunk background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(36,0,70,0.8)_0%,transparent_60%)]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center neon-glow">
            <img
              src="/assets/generated/beast-clipping-logo.dim_320x80.png"
              alt="Beast Clipping"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-3xl font-display tracking-tight">
              Beast Clipping
            </h1>
            <p className="text-primary text-sm mt-1 neon-text">
              Premium clip management dashboard
            </p>
          </div>
        </div>

        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-white font-semibold text-lg">Welcome back</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to access your dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full py-3 px-6 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed neon-glow flex items-center justify-center gap-2"
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-muted-foreground text-xs">
            Secure authentication powered by Internet Identity
          </p>
        </div>

        <p className="text-muted-foreground/50 text-xs flex items-center justify-center gap-1">
          Built with <Heart className="w-3 h-3 text-primary fill-primary" />{" "}
          using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
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
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [suggestedStart, setSuggestedStart] = useState<number | undefined>();
  const [suggestedEnd, setSuggestedEnd] = useState<number | undefined>();
  const [suggestedTitle, setSuggestedTitle] = useState<string | undefined>();
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [caption, setCaption] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<
    import("./backend").AutoGeneratedClipSuggestion[]
  >([]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { data: clips } = useClips();

  const handleVideoLoad = (url: string, id: string) => {
    setVideoUrl(url);
    setVideoId(id);
    setAiSuggestions([]);
  };

  const handleSuggestionSelect = (
    start: number,
    end: number,
    title: string,
  ) => {
    setSuggestedStart(start);
    setSuggestedEnd(end);
    setSuggestedTitle(title);
  };

  const handleTranscriptSelect = (startSec: number, endSec: number) => {
    setSuggestedStart(startSec);
    setSuggestedEnd(endSec);
  };

  const handleClipSaved = () => {
    // React Query handles cache invalidation
  };

  const previewClip =
    selectedClip ||
    (clips && clips.length > 0 ? clips[clips.length - 1] : null);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground font-bold text-2xl font-display">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Create and manage your viral clips
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ChannelConnection />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFeedbackOpen(true)}
            className="text-muted-foreground hover:text-primary"
            title="Report a Bug / Request a Feature"
            data-ocid="dashboard.open_modal_button"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-4">
            <VideoUrlForm
              onSubmit={handleVideoLoad}
              onClipsGenerated={setAiSuggestions}
            />
          </div>

          {videoId && (
            <div className="glass-card p-4">
              <YouTubePlayer videoId={videoId} />
            </div>
          )}

          {/* Transcript Panel */}
          {videoId && (
            <TranscriptPanel
              videoId={videoId}
              onSelectTimestamp={handleTranscriptSelect}
            />
          )}

          {videoId && (
            <ClipSuggestions
              onSelectSuggestion={handleSuggestionSelect}
              aiSuggestions={aiSuggestions}
            />
          )}

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

          <CaptionEditor
            initialCaption={caption}
            onCaptionChange={setCaption}
          />

          <div className="glass-card p-4">
            <h2 className="text-foreground font-semibold text-sm mb-3 flex items-center gap-2">
              My Clips
              {clips && clips.length > 0 && (
                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/30">
                  {clips.length}
                </span>
              )}
            </h2>
            <ClipList onClipSelect={setSelectedClip} />
          </div>

          {/* Social Feed */}
          <SocialFeed />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div>
            <h2 className="text-foreground font-semibold text-sm mb-2 flex items-center gap-2">
              Clip Preview
              <span className="text-muted-foreground text-xs font-normal">
                9:16
              </span>
            </h2>
            <VerticalClipPreview clip={previewClip} />
          </div>

          {/* Clip Queue */}
          <ClipQueue />

          {/* Pinned Links */}
          <PinnedLinks />

          <TrendingSidebar />

          {/* Meme Overlays */}
          <MemeOverlayLibrary />

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
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
          <span className="text-primary text-lg">✂️</span>
        </div>
        <div>
          <h1 className="text-foreground font-bold text-2xl font-display">
            My Clips
          </h1>
          <p className="text-muted-foreground text-sm">
            {clips?.length || 0} clips saved
          </p>
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
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const { data: systemStatus } = useSystemStatus();
  const { data: ownRole } = useGetOwnRole();

  // Normalize role to string
  const roleStr = ownRole
    ? typeof ownRole === "object"
      ? Object.keys(ownRole)[0]
      : String(ownRole)
    : null;
  const isAdmin = roleStr === "admin" || roleStr === "owner";

  if (isInitializing) {
    return (
      <div
        className="min-h-screen bg-[#0B0E14] flex items-center justify-center"
        data-ocid="app.loading_state"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show paused screen for non-admin users when app is paused
  if (systemStatus === SystemStatus.paused && !isAdmin) {
    return <PausedScreen />;
  }

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

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

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const clipsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clips",
  component: ClipsPage,
});
const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trending",
  component: TrendingPage,
});
const schedulerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scheduler",
  component: Scheduler,
});
const contentManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/content-manager",
  component: ContentManager,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
const oauthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/oauth/callback",
  component: OAuthCallback,
});
const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages",
  component: MessagesPage,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  clipsRoute,
  trendingRoute,
  schedulerRoute,
  contentManagerRoute,
  adminRoute,
  oauthCallbackRoute,
  messagesRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
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
        theme="system"
        toastOptions={{
          style: {
            background: "oklch(0.1 0.03 290)",
            border: "1px solid oklch(0.88 0.17 200 / 0.2)",
            color: "oklch(0.95 0.015 200)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

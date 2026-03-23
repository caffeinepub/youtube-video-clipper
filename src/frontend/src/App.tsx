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
import {
  Clock,
  ExternalLink,
  Heart,
  MessageSquare,
  Youtube,
  Zap,
} from "lucide-react";
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
import EditorToolsPanel from "./components/EditorToolsPanel";
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
import WarningBanner from "./components/WarningBanner";
import YouTubePlayer from "./components/YouTubePlayer";
import { useActor } from "./hooks/useActor";
import { useClips } from "./hooks/useClips";
import { useGetOwnRole } from "./hooks/useGetOwnRole";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import { useSystemStatus } from "./hooks/useSystemStatus";
import AffiliatePage from "./pages/AffiliatePage";
import BrowserPage from "./pages/BrowserPage";
import CollabFinderPage from "./pages/CollabFinderPage";
import CommunityHubPage from "./pages/CommunityHubPage";
import ContentManager from "./pages/ContentManager";
import CreativeEffectsPage from "./pages/CreativeEffectsPage";
import DiscoverPage from "./pages/DiscoverPage";
import GamePage from "./pages/GamePage";
import GrowthHubPage from "./pages/GrowthHubPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MessagesPage from "./pages/MessagesPage";
import OAuthCallback from "./pages/OAuthCallback";
import ProFeaturesPage from "./pages/ProFeaturesPage";
import ProfilePage from "./pages/ProfilePage";
import RetentionPage from "./pages/RetentionPage";
import Scheduler from "./pages/Scheduler";
import TrendingPage from "./pages/TrendingPage";
import WorkflowPage from "./pages/WorkflowPage";
import YouTubeStudioPage from "./pages/YouTubeStudioPage";

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
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="font-display font-bold text-sm section-heading">
          Recent Activity
        </h3>
        <span className="live-badge text-xs text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full font-semibold">
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
    <div className="min-h-screen hero-glow flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Atmospheric grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.88 0.17 200) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.17 200) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Floating orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.88 0.17 200) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full opacity-8 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.3 0.15 290) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full opacity-6 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.88 0.17 200) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm space-y-10 text-center">
        {/* Logo area */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-2xl border border-primary/20 animate-pulse-glow" />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/40 flex items-center justify-center neon-glow">
              <Zap
                className="w-9 h-9 text-primary"
                style={{
                  filter: "drop-shadow(0 0 8px oklch(0.88 0.17 200 / 0.7))",
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <h1
              className="font-display font-black tracking-tight leading-none"
              style={{ fontSize: "2.75rem", letterSpacing: "-0.03em" }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.95 0.015 200) 0%, oklch(0.88 0.17 200) 50%, oklch(0.78 0.17 200) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 20px oklch(0.88 0.17 200 / 0.35))",
                }}
              >
                BEAST
              </span>
              <br />
              <span className="text-foreground/90">CLIPPING</span>
            </h1>
            <p
              className="text-primary/80 text-sm font-medium tracking-widest uppercase"
              style={{ letterSpacing: "0.25em" }}
            >
              Premium Clip Dashboard
            </p>
          </div>
        </div>

        {/* Sign-in card */}
        <div className="login-card p-8 space-y-7">
          <div className="space-y-2">
            <h2 className="text-foreground font-bold text-xl font-display tracking-tight">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sign in to manage your clips and channel
            </p>
          </div>

          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            className="neon-cta w-full py-3.5 px-6 rounded-xl font-bold text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <p className="text-muted-foreground/50 text-xs whitespace-nowrap">
              Secured by Internet Identity
            </p>
            <div className="flex-1 h-px bg-white/8" />
          </div>
        </div>

        <p className="text-muted-foreground/40 text-xs flex items-center justify-center gap-1.5">
          Built with{" "}
          <Heart className="w-3 h-3 text-primary/70 fill-primary/70" /> using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/60 hover:text-primary transition-colors"
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
          <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
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

      {/* Warning banner — shows when admin has issued a warning to this user */}
      <WarningBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5">
            <VideoUrlForm
              onSubmit={handleVideoLoad}
              onClipsGenerated={setAiSuggestions}
            />
          </div>

          {videoId && (
            <div className="glass-card p-5">
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
            <div className="glass-card p-5">
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

          <div className="glass-card p-5">
            <h2 className="font-display font-bold text-base mb-4 flex items-center gap-2.5 section-heading">
              My Clips
              {clips && clips.length > 0 && (
                <span className="live-badge bg-primary/15 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/30 font-semibold">
                  {clips.length}
                </span>
              )}
            </h2>
            <ClipList onClipSelect={setSelectedClip} />
          </div>

          {/* Editor Tools */}
          {videoId && (
            <div className="mt-2">
              <EditorToolsPanel />
            </div>
          )}

          {/* Social Feed — wrapped in extra spacing */}
          <div className="mt-2">
            <SocialFeed />
          </div>

          {/* Featured: b3as1 Channel */}
          <div className="cyber-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                  <Youtube className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground leading-none">
                    Featured Channel
                  </h3>
                  <span className="text-xs text-red-400 font-medium tracking-wide">
                    @b3as1
                  </span>
                </div>
              </div>
              <a
                href="https://www.youtube.com/@b3as1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                data-ocid="dashboard.channel.link"
              >
                <ExternalLink className="w-3 h-3" />
                Open Channel
              </a>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/8 bg-black shadow-lg">
              <iframe
                src="https://www.youtube.com/embed?listType=user_uploads&list=b3as1&rel=0&modestbranding=1"
                title="b3as1 YouTube Channel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy"
              />
            </div>
            <p className="text-muted-foreground/60 text-xs text-center">
              Latest clips and highlights from the b3as1 channel
            </p>
          </div>
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
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/25 to-primary/8 border border-primary/30 flex items-center justify-center neon-glow-sm flex-shrink-0">
          <span className="text-primary text-lg leading-none">✂️</span>
        </div>
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight">
            My Clips
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {clips?.length || 0} clips saved
          </p>
        </div>
      </div>
      <div className="glass-card p-5">
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
const collabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collab",
  component: CollabFinderPage,
});
const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game",
  component: GamePage,
});
const discoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discover",
  component: DiscoverPage,
});
const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});
const affiliateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/affiliate",
  component: AffiliatePage,
});
const creativeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creative",
  component: CreativeEffectsPage,
});
const growthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/growth",
  component: GrowthHubPage,
});
const proRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pro",
  component: ProFeaturesPage,
});
const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community",
  component: CommunityHubPage,
});
const magicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/magic",
  component: RetentionPage,
});
const workflowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workflow",
  component: WorkflowPage,
});
const youtubeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/youtube",
  component: YouTubeStudioPage,
});
const browserRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/browser",
  component: BrowserPage,
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
  collabRoute,
  gameRoute,
  discoverRoute,
  leaderboardRoute,
  affiliateRoute,
  creativeRoute,
  growthRoute,
  proRoute,
  communityRoute,
  magicRoute,
  workflowRoute,
  youtubeRoute,
  browserRoute,
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

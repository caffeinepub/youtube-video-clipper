import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import AppShell from './components/AppShell';
import MyClipsPage from './pages/MyClipsPage';
import TrendingPage from './pages/TrendingPage';
import SocialFeedPage from './pages/SocialFeedPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import Scheduler from './pages/Scheduler';
import ContentManager from './pages/ContentManager';
import MyGalleryPage from './pages/MyGalleryPage';
import OAuthCallback from './pages/OAuthCallback';
import ProfileSetup from './components/ProfileSetup';
import PausedScreen from './components/PausedScreen';
import AccountStatusGuard from './components/AccountStatusGuard';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { useSystemStatus } from './hooks/useSystemStatus';
import { useIsOwner } from './hooks/useIsOwner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AppContent() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: systemStatus } = useSystemStatus();
  const { data: isOwner } = useIsOwner();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const isPaused = systemStatus === 'paused';

  if (isPaused && !isOwner) {
    return <PausedScreen />;
  }

  return (
    <AccountStatusGuard>
      <AppShell>
        <Outlet />
      </AppShell>
      {showProfileSetup && <ProfileSetup />}
    </AccountStatusGuard>
  );
}

const rootRoute = createRootRoute({
  component: AppContent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MyClipsPage,
});

const clipsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clips',
  component: MyClipsPage,
});

const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trending',
  component: TrendingPage,
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feed',
  component: SocialFeedPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: MessagesPage,
});

const schedulerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scheduler',
  component: Scheduler,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: MyGalleryPage,
});

const contentManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/content-manager',
  component: ContentManager,
});

const oauthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/oauth/callback',
  component: OAuthCallback,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  clipsRoute,
  trendingRoute,
  feedRoute,
  profileRoute,
  messagesRoute,
  schedulerRoute,
  galleryRoute,
  contentManagerRoute,
  oauthCallbackRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

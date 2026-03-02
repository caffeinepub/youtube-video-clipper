import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './components/AppShell';
import MyClipsPage from './pages/MyClipsPage';
import TrendingPage from './pages/TrendingPage';
import MessagesPage from './pages/MessagesPage';
import OAuthCallback from './pages/OAuthCallback';
import ContentManager from './pages/ContentManager';
import ProfilePage from './pages/ProfilePage';
import SocialFeedPage from './pages/SocialFeedPage';
import MyGalleryPage from './pages/MyGalleryPage';
import AccountStatusGuard from './components/AccountStatusGuard';
import NotificationToastContainer from './components/NotificationToastContainer';
import { useSystemStatus } from './hooks/useSystemStatus';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import PausedScreen from './components/PausedScreen';
import { useIsOwner } from './hooks/useIsOwner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function SystemStatusGuard({ children }: { children: React.ReactNode }) {
  const { data: status } = useSystemStatus();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsOwner();

  if (status === 'paused' && !isAdmin) {
    return <PausedScreen />;
  }

  return <>{children}</>;
}

function Layout() {
  return (
    <AccountStatusGuard>
      <SystemStatusGuard>
        <AppShell>
          <Outlet />
        </AppShell>
        <NotificationToastContainer />
      </SystemStatusGuard>
    </AccountStatusGuard>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MyClipsPage,
});

const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trending',
  component: TrendingPage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: MessagesPage,
});

const oauthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/oauth/callback',
  component: OAuthCallback,
});

const contentManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/content',
  component: ContentManager,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const socialFeedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/social',
  component: SocialFeedPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: MyGalleryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  trendingRoute,
  messagesRoute,
  oauthCallbackRoute,
  contentManagerRoute,
  profileRoute,
  socialFeedRoute,
  galleryRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(36, 0, 70, 0.9)',
              border: '1px solid rgba(0, 242, 255, 0.4)',
              color: '#00f2ff',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

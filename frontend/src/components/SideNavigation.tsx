import React, { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import {
  Scissors,
  TrendingUp,
  Rss,
  Image,
  User,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  LogIn,
  Bell,
  Bug,
  Shield,
  LayoutGrid,
  Heart,
} from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useGetOwnRole } from '../hooks/useGetOwnRole';
import UserIdDisplay from './UserIdDisplay';
import UserRoleBadge from './UserRoleBadge';
import NotificationBell from './NotificationBell';
import FeedbackModal from './FeedbackModal';
import AdminPanel from './AdminPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  authRequired?: boolean;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Clips', path: '/', icon: <Scissors size={18} /> },
  { label: 'Trending', path: '/trending', icon: <TrendingUp size={18} /> },
  { label: 'Feed', path: '/feed', icon: <Rss size={18} /> },
  { label: 'Gallery', path: '/gallery', icon: <Image size={18} />, authRequired: true },
  { label: 'Profile', path: '/profile', icon: <User size={18} />, authRequired: true },
  { label: 'Messages', path: '/messages', icon: <MessageSquare size={18} />, authRequired: true },
  { label: 'Scheduler', path: '/scheduler', icon: <Calendar size={18} />, authRequired: true },
  { label: 'Content', path: '/content-manager', icon: <LayoutGrid size={18} />, authRequired: true },
];

export default function SideNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: role } = useGetOwnRole();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const isOwner = role === 'owner' || role === 'admin';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      if (error?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.authRequired && !isAuthenticated) return false;
    return true;
  });

  const currentPath = location.pathname;

  return (
    <nav className="w-64 h-full flex flex-col bg-card border-r border-border/50 relative overflow-hidden">
      {/* Cyberpunk accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/beast-clipping-logo.dim_256x256.png"
            alt="Beast Clipping"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-lg font-bold text-primary tracking-wider">BEAST</h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">Clipping</p>
          </div>
        </div>
      </div>

      {/* User info */}
      {isAuthenticated && (
        <div className="p-3 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {userProfile?.name ? userProfile.name[0].toUpperCase() : '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userProfile?.name || 'Loading...'}
              </p>
              {role && <UserRoleBadge role={role as any} />}
            </div>
            <NotificationBell />
          </div>
          <UserIdDisplay />
        </div>
      )}

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredNavItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 relative group ${
                isActive
                  ? 'text-primary bg-primary/10 border-r-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <span className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border/50 space-y-1">
        {/* Feedback button */}
        <button
          onClick={() => setFeedbackOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200 rounded-sm"
        >
          <Bug size={18} />
          <span>Report / Request</span>
        </button>

        {/* Admin panel button */}
        {isOwner && (
          <button
            onClick={() => setAdminOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-accent hover:text-accent/80 hover:bg-accent/10 transition-all duration-200 rounded-sm"
          >
            <Shield size={18} />
            <span>Admin Panel</span>
          </button>
        )}

        {/* Login/Logout */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={handleLogin}
            disabled={loginStatus === 'logging-in'}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-primary/10 transition-all duration-200 rounded-sm disabled:opacity-50"
          >
            <LogIn size={18} />
            <span>{loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border/30">
        <p className="text-xs text-muted-foreground/50 text-center">
          Built with <Heart size={10} className="inline text-primary" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/70 hover:text-primary"
          >
            caffeine.ai
          </a>
        </p>
        <p className="text-xs text-muted-foreground/30 text-center">© {new Date().getFullYear()} Beast Clipping</p>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />

      {/* Admin Panel Dialog */}
      {isOwner && (
        <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2">
                <Shield size={20} />
                Admin Panel
              </DialogTitle>
            </DialogHeader>
            <AdminPanel />
          </DialogContent>
        </Dialog>
      )}
    </nav>
  );
}

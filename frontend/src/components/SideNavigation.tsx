import React, { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import {
  Scissors, TrendingUp, MessageSquare, LogOut, LogIn,
  User, Users, Sparkles, Bell, Loader2, FileText
} from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useGetOwnRole } from '../hooks/useGetOwnRole';
import { useIsOwner } from '../hooks/useIsOwner';
import FeedbackModal from './FeedbackModal';
import NotificationBell from './NotificationBell';

export default function SideNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userRole } = useGetOwnRole();
  const { data: isAdmin } = useIsOwner();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItems = [
    { path: '/', label: 'My Clips', icon: Scissors, requireAuth: false },
    { path: '/trending', label: 'Trending', icon: TrendingUp, requireAuth: false },
    { path: '/social', label: 'Social Feed', icon: Users, requireAuth: true },
    { path: '/profile', label: 'Profile', icon: User, requireAuth: true },
    { path: '/gallery', label: 'My Gallery', icon: Sparkles, requireAuth: true },
    { path: '/messages', label: 'Messages', icon: MessageSquare, requireAuth: true },
    { path: '/content', label: 'Content', icon: FileText, requireAuth: true, adminOnly: true },
  ];

  const visibleItems = navItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.requireAuth && !isAuthenticated) return false;
    return true;
  });

  return (
    <div className="w-64 h-screen flex flex-col glass-panel border-r border-cyan-neon/20 sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-cyan-neon/20">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/beast-clipping-logo.dim_256x256.png"
            alt="Beast Clipping"
            className="w-10 h-10 rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div>
            <h1 className="font-orbitron text-sm font-bold neon-text">BEAST</h1>
            <p className="font-orbitron text-xs text-cyan-neon/60">CLIPPING</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {isAuthenticated && (
        <div className="p-4 border-b border-cyan-neon/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-cyan-neon" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground truncate max-w-[100px]">
                  {userProfile?.name || 'Player'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{userRole || 'user'}</p>
              </div>
            </div>
            <NotificationBell />
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-cyber">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth text-left ${
                isActive
                  ? 'cyberpunk-btn-active neon-text font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-cyan-neon/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-neon' : ''}`} />
              <span className="text-sm font-rajdhani">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-cyan-neon/20 space-y-2">
        {isAuthenticated && (
          <button
            onClick={() => setFeedbackOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-cyan-neon/5 transition-smooth text-sm"
          >
            <Bell className="w-4 h-4" />
            <span>Feedback</span>
          </button>
        )}
        <button
          onClick={handleAuth}
          disabled={isLoggingIn}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth text-sm cyberpunk-btn"
        >
          {isLoggingIn ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isAuthenticated ? (
            <LogOut className="w-4 h-4" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          <span>{isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}</span>
        </button>
      </div>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}

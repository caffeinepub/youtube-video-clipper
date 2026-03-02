import React, { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Scissors, TrendingUp, MessageSquare, User, Users, Sparkles } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import FeedbackModal from './FeedbackModal';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const isAuthenticated = !!identity;

  const navItems = [
    { path: '/', label: 'Clips', icon: Scissors, requireAuth: false },
    { path: '/trending', label: 'Trending', icon: TrendingUp, requireAuth: false },
    { path: '/social', label: 'Feed', icon: Users, requireAuth: true },
    { path: '/gallery', label: 'Gallery', icon: Sparkles, requireAuth: true },
    { path: '/profile', label: 'Profile', icon: User, requireAuth: true },
    { path: '/messages', label: 'Messages', icon: MessageSquare, requireAuth: true },
  ];

  const visibleItems = navItems.filter(item => {
    if (item.requireAuth && !isAuthenticated) return false;
    return true;
  });

  return (
    <div className="glass-panel border-t border-cyan-neon/20 px-2 py-2">
      <div className="flex items-center justify-around">
        {visibleItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-smooth ${
                isActive ? 'text-cyan-neon' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_6px_rgba(0,242,255,0.8)]' : ''}`} />
              <span className="text-xs font-rajdhani">{item.label}</span>
            </button>
          );
        })}
      </div>
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}

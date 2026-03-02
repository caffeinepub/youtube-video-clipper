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
  Bug,
  Shield,
} from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetOwnRole } from '../hooks/useGetOwnRole';
import FeedbackModal from './FeedbackModal';
import AdminPanel from './AdminPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  authRequired?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Clips', path: '/', icon: <Scissors size={20} /> },
  { label: 'Trending', path: '/trending', icon: <TrendingUp size={20} /> },
  { label: 'Feed', path: '/feed', icon: <Rss size={20} /> },
  { label: 'Gallery', path: '/gallery', icon: <Image size={20} />, authRequired: true },
  { label: 'Messages', path: '/messages', icon: <MessageSquare size={20} />, authRequired: true },
  { label: 'Profile', path: '/profile', icon: <User size={20} />, authRequired: true },
];

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: role } = useGetOwnRole();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const isOwner = role === 'owner' || role === 'admin';

  const filteredNavItems = navItems.filter(item => {
    if (item.authRequired && !isAuthenticated) return false;
    return true;
  });

  const currentPath = location.pathname;

  return (
    <nav className="bg-card border-t border-border/50 px-2 py-1 relative">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
      <div className="flex items-center justify-around">
        {filteredNavItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[48px] ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}

        {/* Feedback button */}
        <button
          onClick={() => setFeedbackOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[48px] text-muted-foreground hover:text-foreground"
        >
          <Bug size={20} />
          <span className="text-[10px] font-medium">Feedback</span>
        </button>

        {/* Admin button (owner only) */}
        {isOwner && (
          <button
            onClick={() => setAdminOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[48px] text-accent hover:text-accent/80"
          >
            <Shield size={20} />
            <span className="text-[10px] font-medium">Admin</span>
          </button>
        )}
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

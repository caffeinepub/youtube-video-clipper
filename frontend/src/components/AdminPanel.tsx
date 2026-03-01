import React, { useState } from 'react';
import {
  Shield,
  Users,
  Activity,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronUp,
  Lock,
} from 'lucide-react';
import { useIsOwner } from '../hooks/useIsOwner';
import { useGetOwnRole } from '../hooks/useGetOwnRole';
import UserStatusManagement from './UserStatusManagement';
import ActivityLogTable from './ActivityLogTable';
import AdminManagement from './AdminManagement';
import AdminMessaging from './AdminMessaging';
import FeedbackSubmissions from './FeedbackSubmissions';
import AppAnalytics from './AppAnalytics';
import SystemControls from './SystemControls';
import AdminErrorBoundary from './AdminErrorBoundary';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

function CollapsibleSection({ title, icon, children, defaultOpen = false, badge }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            {icon}
          </div>
          <span className="text-white font-semibold text-sm">{title}</span>
          {badge && (
            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">
              {badge}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t border-white/8 p-4">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const { isOwner } = useIsOwner();
  const { data: ownRole, isLoading: roleLoading } = useGetOwnRole();

  // Normalize role to string
  const roleStr = ownRole
    ? (typeof ownRole === 'object' ? Object.keys(ownRole)[0] : String(ownRole))
    : null;

  const isAdmin = roleStr === 'admin' || roleStr === 'owner' || isOwner;

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-white font-bold text-xl mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          You don't have permission to access the Admin Panel. Contact an administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center indigo-glow-sm">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl font-display">Admin Panel</h1>
            <p className="text-muted-foreground text-xs">System management and analytics</p>
          </div>
        </div>

        {/* Analytics */}
        <CollapsibleSection
          title="Analytics & Stats"
          icon={<Activity className="w-4 h-4 text-indigo-400" />}
          defaultOpen={true}
          badge="Live"
        >
          <AppAnalytics />
        </CollapsibleSection>

        {/* System Controls */}
        <CollapsibleSection
          title="System Controls"
          icon={<Settings className="w-4 h-4 text-orange-400" />}
        >
          <SystemControls />
        </CollapsibleSection>

        {/* User Management */}
        <CollapsibleSection
          title="User & Clip Management"
          icon={<Users className="w-4 h-4 text-indigo-400" />}
        >
          <UserStatusManagement />
        </CollapsibleSection>

        {/* Activity Logs */}
        <CollapsibleSection
          title="Activity Logs"
          icon={<Activity className="w-4 h-4 text-emerald-400" />}
          badge="Auto-refresh"
        >
          <ActivityLogTable />
        </CollapsibleSection>

        {/* Admin Management */}
        <CollapsibleSection
          title="Admin Management"
          icon={<Shield className="w-4 h-4 text-purple-400" />}
        >
          <AdminManagement />
        </CollapsibleSection>

        {/* Messaging */}
        <CollapsibleSection
          title="Support Messaging"
          icon={<MessageSquare className="w-4 h-4 text-blue-400" />}
        >
          <AdminMessaging />
        </CollapsibleSection>

        {/* Feedback */}
        <CollapsibleSection
          title="Feedback Submissions"
          icon={<MessageSquare className="w-4 h-4 text-pink-400" />}
        >
          <FeedbackSubmissions />
        </CollapsibleSection>
      </div>
    </AdminErrorBoundary>
  );
}

import React, { useState } from 'react';
import { useIsOwner } from '../hooks/useIsOwner';
import AdminErrorBoundary from './AdminErrorBoundary';
import SystemControls from './SystemControls';
import AppAnalytics from './AppAnalytics';
import UserStatusManagement from './UserStatusManagement';
import AdminMessaging from './AdminMessaging';
import FeedbackSubmissions from './FeedbackSubmissions';
import ActivityLogTable from './ActivityLogTable';
import AdminManagement from './AdminManagement';
import AdminDebugPanel from './AdminDebugPanel';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Shield, BarChart2, Users, MessageSquare, Bug, Activity, UserPlus, Terminal } from 'lucide-react';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 rounded-lg border border-border/50 transition-colors">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        {open ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 mb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function AdminPanel() {
  const { data: isOwner, isLoading } = useIsOwner();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Shield size={48} className="mx-auto mb-3 opacity-30" />
        <p>Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="space-y-3 p-1">
        <CollapsibleSection title="System Controls" icon={<Shield size={16} />} defaultOpen>
          <SystemControls />
        </CollapsibleSection>

        <CollapsibleSection title="Analytics" icon={<BarChart2 size={16} />}>
          <AppAnalytics />
        </CollapsibleSection>

        <CollapsibleSection title="User Management" icon={<Users size={16} />}>
          <UserStatusManagement />
        </CollapsibleSection>

        <CollapsibleSection title="Admin Messaging" icon={<MessageSquare size={16} />}>
          <AdminMessaging />
        </CollapsibleSection>

        <CollapsibleSection title="Feedback Submissions" icon={<Bug size={16} />}>
          <FeedbackSubmissions />
        </CollapsibleSection>

        <CollapsibleSection title="Activity Logs" icon={<Activity size={16} />}>
          <ActivityLogTable />
        </CollapsibleSection>

        <CollapsibleSection title="Admin Management" icon={<UserPlus size={16} />}>
          <AdminManagement />
        </CollapsibleSection>

        <CollapsibleSection title="Debug Panel" icon={<Terminal size={16} />}>
          <AdminDebugPanel />
        </CollapsibleSection>
      </div>
    </AdminErrorBoundary>
  );
}

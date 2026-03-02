import React, { useState } from 'react';
import { useIsOwner } from '../hooks/useIsOwner';
import { ChevronDown, ChevronUp, Shield, Users, Activity, MessageSquare, FileText, BarChart2 } from 'lucide-react';
import { AdminMessaging } from './AdminMessaging';
import { SystemControls } from './SystemControls';
import UserStatusManagement from './UserStatusManagement';
import FeedbackSubmissions from './FeedbackSubmissions';
import ActivityLogTable from './ActivityLogTable';
import AppAnalytics from './AppAnalytics';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-cyan-neon/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-cyan-neon/5 transition-smooth"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-orbitron text-xs text-cyan-neon">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t border-cyan-neon/20 p-4">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const { data: isAdmin } = useIsOwner();

  if (!isAdmin) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-cyan-neon" />
        <h2 className="font-orbitron text-sm text-cyan-neon">ADMIN PANEL</h2>
      </div>

      <Section title="SYSTEM CONTROLS" icon={<Shield className="w-4 h-4 text-cyan-neon" />} defaultOpen>
        <SystemControls />
      </Section>

      <Section title="ANALYTICS" icon={<BarChart2 className="w-4 h-4 text-cyan-neon" />}>
        <AppAnalytics />
      </Section>

      <Section title="USER MANAGEMENT" icon={<Users className="w-4 h-4 text-cyan-neon" />}>
        <UserStatusManagement />
      </Section>

      <Section title="MESSAGING" icon={<MessageSquare className="w-4 h-4 text-cyan-neon" />}>
        <AdminMessaging />
      </Section>

      <Section title="FEEDBACK" icon={<FileText className="w-4 h-4 text-cyan-neon" />}>
        <FeedbackSubmissions />
      </Section>

      <Section title="ACTIVITY LOGS" icon={<Activity className="w-4 h-4 text-cyan-neon" />}>
        <ActivityLogTable />
      </Section>
    </div>
  );
}

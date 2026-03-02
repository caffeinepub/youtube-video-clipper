import React from 'react';
import SideNavigation from './SideNavigation';
import BottomNavigation from './BottomNavigation';
import NotificationToastContainer from './NotificationToastContainer';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <SideNavigation />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>

      <NotificationToastContainer />
    </div>
  );
}

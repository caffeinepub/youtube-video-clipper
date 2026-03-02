import React from 'react';
import SideNavigation from './SideNavigation';
import BottomNavigation from './BottomNavigation';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #0d0020 0%, #1a0035 50%, #0d0020 100%)' }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <SideNavigation />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="min-h-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  );
}

import React from 'react';
import SideNavigation from './SideNavigation';
import BottomNavigation from './BottomNavigation';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <SideNavigation />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin pb-20 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}

import React from 'react';

// Layout is now handled by AppShell; this is kept as a passthrough for compatibility.
interface LayoutProps {
  children: React.ReactNode;
  onOpenFeedback?: () => void;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}

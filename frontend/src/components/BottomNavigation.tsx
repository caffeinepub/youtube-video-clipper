import React from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Home, Scissors, TrendingUp, Calendar, Shield, FileText } from 'lucide-react';
import { useGetOwnRole } from '../hooks/useGetOwnRole';

const navItems = [
  { path: '/', label: 'Home', icon: Home, roles: ['owner', 'admin', 'user', 'friend'] },
  { path: '/clips', label: 'Clips', icon: Scissors, roles: ['owner', 'admin', 'user', 'friend'] },
  { path: '/trending', label: 'Trending', icon: TrendingUp, roles: ['owner', 'admin', 'user', 'friend'] },
  { path: '/scheduler', label: 'Schedule', icon: Calendar, roles: ['owner', 'admin', 'user', 'friend'] },
  { path: '/content-manager', label: 'Content', icon: FileText, roles: ['owner', 'admin'] },
  { path: '/admin', label: 'Admin', icon: Shield, roles: ['owner', 'admin'] },
];

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: ownRole } = useGetOwnRole();

  // Normalize role to string
  const roleStr = ownRole
    ? (typeof ownRole === 'object' ? Object.keys(ownRole)[0] : String(ownRole))
    : null;

  const filteredItems = navItems.filter(item => {
    if (!roleStr) return item.roles.includes('user');
    return item.roles.includes(roleStr);
  });

  // Show max 5 items on mobile
  const displayItems = filteredItems.slice(0, 5);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0E14]/90 backdrop-blur-xl border-t border-white/10 px-2 py-2">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {displayItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                active ? 'text-indigo-400' : 'text-muted-foreground hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-200 ${active ? 'bg-indigo-500/20' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-indigo-400" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import React from 'react';
import { Crown, Shield, User, Star } from 'lucide-react';

interface UserRoleBadgeProps {
  role: string;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const getRoleConfig = (r: string) => {
    switch (r?.toLowerCase()) {
      case 'owner':
        return { label: 'Owner', icon: <Crown size={10} />, className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case 'admin':
        return { label: 'Admin', icon: <Shield size={10} />, className: 'bg-primary/20 text-primary border-primary/30' };
      case 'friend':
        return { label: 'Friend', icon: <Star size={10} />, className: 'bg-accent/20 text-accent border-accent/30' };
      default:
        return { label: 'User', icon: <User size={10} />, className: 'bg-muted/50 text-muted-foreground border-border/50' };
    }
  };

  const config = getRoleConfig(role);

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

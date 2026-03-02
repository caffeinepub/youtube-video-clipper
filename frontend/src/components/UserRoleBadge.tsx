import React from 'react';
import { UserRole } from '../backend';
import { Crown, Shield, User, Star } from 'lucide-react';

interface UserRoleBadgeProps {
  role: string;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  switch (role) {
    case 'owner':
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400">
          <Crown className="w-3 h-3" />
          Owner
        </span>
      );
    case UserRole.admin:
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 text-cyan-neon">
          <Shield className="w-3 h-3" />
          Admin
        </span>
      );
    case 'friend':
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400">
          <Star className="w-3 h-3" />
          Friend
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-muted-foreground">
          <User className="w-3 h-3" />
          User
        </span>
      );
  }
}

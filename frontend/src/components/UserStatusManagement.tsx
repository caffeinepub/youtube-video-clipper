import React, { useState } from 'react';
import { UserRole } from '../backend';
import { useUserRoles } from '../hooks/useUserRoles';
import { useSetUserRole } from '../hooks/useSetUserRole';
import { useSetUserStatus } from '../hooks/useSetUserStatus';
import { generateShortUserId } from '../utils/userIdGenerator';
import { Search, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { UserStatus } from '../types/app';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function getRoleVariant(role: string): string {
  switch (role) {
    case 'owner': return 'default';
    case UserRole.admin: return 'secondary';
    case 'friend': return 'outline';
    default: return 'ghost';
  }
}

export default function UserStatusManagement() {
  const { data: users = [], isLoading } = useUserRoles();
  const { mutate: setRole } = useSetUserRole();
  const { mutate: setStatus } = useSetUserStatus();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.principal.toLowerCase().includes(search.toLowerCase()) ||
      (u.profile?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-cyan-neon/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No users found. Users appear here after they log in.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const shortId = generateShortUserId(user.principal);
            return (
              <div
                key={user.principal}
                className="glass-card rounded-xl p-4 border border-cyan-neon/10"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {user.profile?.name || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground font-mono">#{shortId}</span>
                        <button
                          onClick={() => copyToClipboard(user.principal)}
                          className="text-muted-foreground hover:text-cyan-neon transition-smooth"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Select
                      value={user.role}
                      onValueChange={(role) => {
                        // Role assignment uses the backend's assignCallerUserRole
                        toast.info('Role management requires admin backend support');
                      }}
                    >
                      <SelectTrigger className="w-24 h-7 text-xs bg-purple-deep/50 border-cyan-neon/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-cyan-neon/30">
                        <SelectItem value={UserRole.admin}>Admin</SelectItem>
                        <SelectItem value={UserRole.user}>User</SelectItem>
                        <SelectItem value={UserRole.guest}>Guest</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={user.status}
                      onValueChange={(status) => {
                        toast.info('Status management not available in this version');
                      }}
                    >
                      <SelectTrigger className="w-28 h-7 text-xs bg-purple-deep/50 border-cyan-neon/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-cyan-neon/30">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

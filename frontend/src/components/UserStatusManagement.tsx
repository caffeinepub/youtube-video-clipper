import React, { useState } from 'react';
import { useUserRoles } from '../hooks/useUserRoles';
import { generateShortUserId } from '../utils/userIdGenerator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Copy, Check, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { UserRole } from '../backend';

export default function UserStatusManagement() {
  const { data: users = [], isLoading } = useUserRoles();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredUsers = (users as any[]).filter((u: any) => {
    if (!search) return true;
    const shortId = u.principal ? generateShortUserId(u.principal) : '';
    return (
      shortId.toLowerCase().includes(search.toLowerCase()) ||
      u.principal?.toLowerCase().includes(search.toLowerCase()) ||
      u.profile?.name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const copyPrincipal = async (principal: string) => {
    await navigator.clipboard.writeText(principal);
    setCopiedId(principal);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Principal copied!');
  };

  const handleRoleChange = async (principal: string, role: string) => {
    if (!actor) {
      toast.error('Actor not available');
      return;
    }
    try {
      // Map string role to UserRole enum
      let userRole: UserRole;
      if (role === UserRole.admin) {
        userRole = UserRole.admin;
      } else if (role === UserRole.guest) {
        userRole = UserRole.guest;
      } else {
        userRole = UserRole.user;
      }
      const { Principal } = await import('@icp-sdk/core/principal');
      await actor.assignCallerUserRole(Principal.fromText(principal), userRole);
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      toast.success('Role updated');
    } catch (err: any) {
      toast.error(`Failed to update role: ${err.message}`);
    }
  };

  const handleStatusChange = async (principal: string, status: string) => {
    // Status management is a stub — backend doesn't support it yet
    toast.info(`Status change to "${status}" noted (backend support pending)`);
  };

  return (
    <div className="bg-card rounded-lg border border-border/50 p-4 space-y-3">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="pl-8 bg-background border-border text-foreground text-sm h-8"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <Users size={24} className="mx-auto mb-1 opacity-30" />
          <p className="text-xs">
            {search ? 'No matching users' : 'No users found'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredUsers.map((user: any) => {
            const shortId = user.principal
              ? generateShortUserId(user.principal)
              : 'unknown';
            return (
              <div
                key={user.principal}
                className="bg-background/50 rounded-lg border border-border/30 p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-primary font-bold">
                    {shortId}
                  </span>
                  <span className="text-xs text-muted-foreground truncate flex-1">
                    {user.profile?.name || 'No name'}
                  </span>
                  <button
                    onClick={() => copyPrincipal(user.principal)}
                    className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                  >
                    {copiedId === user.principal ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={user.role || 'user'}
                    onValueChange={(role) =>
                      handleRoleChange(user.principal, role)
                    }
                  >
                    <SelectTrigger className="h-7 text-xs bg-background border-border flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value={UserRole.admin} className="text-xs">
                        Admin
                      </SelectItem>
                      <SelectItem value={UserRole.user} className="text-xs">
                        User
                      </SelectItem>
                      <SelectItem value={UserRole.guest} className="text-xs">
                        Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={user.status || 'active'}
                    onValueChange={(status) =>
                      handleStatusChange(user.principal, status)
                    }
                  >
                    <SelectTrigger className="h-7 text-xs bg-background border-border flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="active" className="text-xs">
                        Active
                      </SelectItem>
                      <SelectItem value="inactive" className="text-xs">
                        Inactive
                      </SelectItem>
                      <SelectItem value="suspended" className="text-xs">
                        Suspended
                      </SelectItem>
                      <SelectItem value="banned" className="text-xs">
                        Banned
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

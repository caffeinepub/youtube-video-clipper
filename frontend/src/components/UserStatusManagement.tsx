import React, { useState } from 'react';
import { Search, Trash2, Loader2, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useUserRoles } from '../hooks/useUserRoles';
import { useSetUserStatus } from '../hooks/useSetUserStatus';
import { useActor } from '../hooks/useActor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { generateShortUserId } from '../utils/userIdGenerator';
import { UserStatus } from '../backend';
import { Principal } from '@dfinity/principal';

function useDeleteClipsByUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteClipsByUser(userId);
    },
    onSuccess: () => {
      toast.success('User clips deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['clips'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete clips: ${err.message}`);
    },
  });
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  suspended: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  banned: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  admin: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  user: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  friend: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

export default function UserStatusManagement() {
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const { data: users, isLoading } = useUserRoles();
  const setStatusMutation = useSetUserStatus();
  const deleteClipsMutation = useDeleteClipsByUser();

  const filtered = (users || []).filter(u => {
    const principalStr = u.principal.toString();
    return (
      principalStr.toLowerCase().includes(search.toLowerCase()) ||
      u.profile?.name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const toggleSelect = (principalStr: string) => {
    setSelectedUsers(prev => {
      const next = new Set(prev);
      if (next.has(principalStr)) next.delete(principalStr);
      else next.add(principalStr);
      return next;
    });
  };

  const handleBulkDeleteClips = () => {
    selectedUsers.forEach(userId => {
      deleteClipsMutation.mutate(userId);
    });
    setSelectedUsers(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Search + Bulk Actions */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 h-9"
          />
        </div>
        {selectedUsers.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Clips ({selectedUsers.size})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#0B0E14] border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete User Clips?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This will permanently delete all clips for {selectedUsers.size} selected user(s). This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleBulkDeleteClips}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete All Clips
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* User Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No users found</div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
          {filtered.map((user) => {
            const principalStr = user.principal.toString();
            const shortId = generateShortUserId(principalStr);
            const isSelected = selectedUsers.has(principalStr);

            // Normalize status and role to string keys
            const statusKey = typeof user.status === 'object'
              ? Object.keys(user.status)[0]
              : String(user.status);
            const roleKey = typeof user.role === 'object'
              ? Object.keys(user.role)[0]
              : String(user.role);

            return (
              <div
                key={principalStr}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/30'
                    : 'bg-white/3 border-white/8 hover:bg-white/5'
                }`}
              >
                {/* Checkbox */}
                <button onClick={() => toggleSelect(principalStr)} className="flex-shrink-0">
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium truncate">
                      {user.profile?.name || `User ${shortId}`}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${ROLE_COLORS[roleKey] || ROLE_COLORS.user}`}>
                      {roleKey}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs font-mono truncate">{shortId}</p>
                </div>

                {/* Status Badge */}
                <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[statusKey] || STATUS_COLORS.active}`}>
                  {statusKey}
                </span>

                {/* Status Select */}
                <Select
                  value={statusKey}
                  onValueChange={(val) => {
                    const statusMap: Record<string, UserStatus> = {
                      active: UserStatus.active,
                      inactive: UserStatus.inactive,
                      suspended: UserStatus.suspended,
                      banned: UserStatus.banned,
                    };
                    setStatusMutation.mutate({
                      target: Principal.fromText(principalStr),
                      status: statusMap[val] || UserStatus.active,
                    });
                  }}
                >
                  <SelectTrigger className="w-28 h-7 text-xs bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0B0E14] border-white/10">
                    <SelectItem value="active" className="text-emerald-400 text-xs">Active</SelectItem>
                    <SelectItem value="inactive" className="text-gray-400 text-xs">Inactive</SelectItem>
                    <SelectItem value="suspended" className="text-yellow-400 text-xs">Suspended</SelectItem>
                    <SelectItem value="banned" className="text-red-400 text-xs">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      )}

      {selectedUsers.size > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
          <AlertTriangle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <p className="text-indigo-300/80 text-xs">{selectedUsers.size} user(s) selected for batch operations</p>
        </div>
      )}
    </div>
  );
}

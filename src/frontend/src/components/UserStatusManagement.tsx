import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Check, Copy, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { UserRole, UserStatus } from "../backend";
import { useActor } from "../hooks/useActor";
import { useCustomRolesMap, useSetCustomRole } from "../hooks/useCustomRoles";
import { useSetUserRole } from "../hooks/useSetUserRole";
import { useSetUserStatus } from "../hooks/useSetUserStatus";
import { useUserRoles } from "../hooks/useUserRoles";
import type { CustomRole } from "../utils/customRoles";
import { generateShortUserId } from "../utils/userIdGenerator";
import { getWarnings } from "../utils/warnings";
import UserRoleBadge from "./UserRoleBadge";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-1 p-0.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3 h-3 text-success" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

// Combined role value: either a UserRole or a custom display role
type CombinedRole = UserRole | CustomRole;

export default function UserStatusManagement() {
  const { data: users, isLoading } = useUserRoles();
  const { mutate: setStatus, isPending: isSettingStatus } = useSetUserStatus();
  const { mutate: setRole, isPending: isSettingRole } = useSetUserRole();
  const { actor } = useActor();
  const customRolesMap = useCustomRolesMap();
  const { mutate: setCustomRoleMutation } = useSetCustomRole();
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);

  const filteredUsers = users?.filter((user) => {
    const principalStr = user.principal.toString();
    const shortId = generateShortUserId(principalStr);
    const name = user.profile?.name ?? "";
    const q = search.toLowerCase();
    return (
      principalStr.toLowerCase().includes(q) ||
      shortId.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q)
    );
  });

  const toggleSelectUser = (principalStr: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(principalStr)) next.delete(principalStr);
      else next.add(principalStr);
      return next;
    });
  };

  const handleBatchDeleteClips = async () => {
    if (!actor || selectedUsers.size === 0) return;
    setIsDeletingBatch(true);
    try {
      await Promise.all(
        Array.from(selectedUsers).map((principalStr) =>
          actor.deleteClipsByUser(principalStr),
        ),
      );
      toast.success(`Deleted clips for ${selectedUsers.size} user(s)`);
      setSelectedUsers(new Set());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to delete clips: ${msg}`);
    } finally {
      setIsDeletingBatch(false);
    }
  };

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case UserStatus.active:
        return "default";
      case UserStatus.banned:
        return "destructive";
      case UserStatus.suspended:
        return "secondary";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Loading users…
      </div>
    );
  }

  // Safe derived values to avoid undefined comparisons
  const filteredCount = filteredUsers?.length ?? 0;
  const allSelected =
    filteredCount > 0 &&
    (filteredUsers?.every((u) => selectedUsers.has(u.principal.toString())) ??
      false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, short ID, or principal…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {selectedUsers.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBatchDeleteClips}
            disabled={isDeletingBatch}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Clips ({selectedUsers.size})
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedUsers(
                        new Set(
                          filteredUsers?.map((u) => u.principal.toString()) ??
                            [],
                        ),
                      );
                    } else {
                      setSelectedUsers(new Set());
                    }
                  }}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Principal ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCount === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
            {filteredUsers?.map((user) => {
              const principalStr = user.principal.toString();
              const shortId = generateShortUserId(principalStr);
              const isSelected = selectedUsers.has(principalStr);

              const customRole = customRolesMap[principalStr] ?? null;
              const warningCount = getWarnings(principalStr).length;

              return (
                <TableRow
                  key={principalStr}
                  className={isSelected ? "bg-muted/30" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelectUser(principalStr)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-medium text-sm">
                        {user.profile?.name ?? "Unknown"}
                        {warningCount > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-yellow-400 text-xs font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            {warningCount}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        #{shortId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 max-w-[220px]">
                      <span
                        className="font-mono text-xs text-muted-foreground truncate"
                        title={principalStr}
                      >
                        {principalStr}
                      </span>
                      <CopyButton text={principalStr} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserRoleBadge
                        role={user.role}
                        customRole={customRole}
                        size="sm"
                      />
                      {user.role !== UserRole.owner && (
                        <Select
                          value={customRole ?? user.role}
                          onValueChange={(value: CombinedRole) => {
                            const customRoles: CustomRole[] = [
                              "tester",
                              "mod",
                              "helper",
                            ];
                            if (customRoles.includes(value as CustomRole)) {
                              // Store custom role in backend so it persists across devices
                              setCustomRoleMutation({
                                principalStr,
                                role: value as CustomRole,
                              });
                              toast.success(`Role set to ${value}`);
                            } else {
                              // Clear any custom role in backend and set real backend role
                              setCustomRoleMutation({
                                principalStr,
                                role: null,
                              });
                              setRole({
                                target: user.principal,
                                role: value as UserRole,
                              });
                            }
                          }}
                          disabled={isSettingRole}
                        >
                          <SelectTrigger className="h-7 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UserRole.admin}>
                              Admin
                            </SelectItem>
                            <SelectItem value={UserRole.user}>User</SelectItem>
                            <SelectItem value={UserRole.friend}>
                              Friend
                            </SelectItem>
                            <SelectItem value="tester">Tester</SelectItem>
                            <SelectItem value="mod">Mod</SelectItem>
                            <SelectItem value="helper">Helper</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getStatusBadgeVariant(
                          user.profile?.status ?? UserStatus.inactive,
                        )}
                      >
                        {user.profile?.status ?? "unknown"}
                      </Badge>
                      <Select
                        value={user.profile?.status ?? UserStatus.inactive}
                        onValueChange={(value) =>
                          setStatus({
                            target: user.principal,
                            status: value as UserStatus,
                          })
                        }
                        disabled={isSettingStatus}
                      >
                        <SelectTrigger className="h-7 w-28 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserStatus.active}>
                            Active
                          </SelectItem>
                          <SelectItem value={UserStatus.inactive}>
                            Inactive
                          </SelectItem>
                          <SelectItem value={UserStatus.suspended}>
                            Suspended
                          </SelectItem>
                          <SelectItem value={UserStatus.banned}>
                            Banned
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                      onClick={() => {
                        if (actor) {
                          actor
                            .deleteClipsByUser(principalStr)
                            .then(() => {
                              toast.success("User clips deleted");
                            })
                            .catch((err: unknown) => {
                              const msg =
                                err instanceof Error
                                  ? err.message
                                  : "Unknown error";
                              toast.error(`Failed: ${msg}`);
                            });
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Del Clips
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

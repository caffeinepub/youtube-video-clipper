import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { useUserRoles } from '../hooks/useUserRoles';
import { useSetUserRole } from '../hooks/useSetUserRole';
import { useSetUserStatus } from '../hooks/useSetUserStatus';
import { UserRole, UserStatus } from '../backend';
import UserRoleBadge from './UserRoleBadge';
import { Principal } from '@icp-sdk/core/principal';

export default function UserStatusManagement() {
  const { data: users, isLoading, error } = useUserRoles();
  const setUserRoleMutation = useSetUserRole();
  const setUserStatusMutation = useSetUserStatus();
  const [searchTerm, setSearchTerm] = useState('');

  const handleRoleChange = async (principalText: string, newRole: UserRole) => {
    try {
      const principal = Principal.fromText(principalText);
      await setUserRoleMutation.mutateAsync({ target: principal, role: newRole });
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  const handleStatusChange = async (principalText: string, newStatus: UserStatus) => {
    try {
      const principal = Principal.fromText(principalText);
      await setUserStatusMutation.mutateAsync({ target: principal, status: newStatus });
    } catch (error) {
      console.error('Failed to change status:', error);
    }
  };

  const getStatusBadgeVariant = (status: UserStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case UserStatus.active:
        return 'default';
      case UserStatus.inactive:
        return 'secondary';
      case UserStatus.suspended:
        return 'outline';
      case UserStatus.banned:
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: UserStatus): string => {
    switch (status) {
      case UserStatus.active:
        return 'Active';
      case UserStatus.inactive:
        return 'Inactive';
      case UserStatus.suspended:
        return 'Suspended';
      case UserStatus.banned:
        return 'Banned';
      default:
        return status;
    }
  };

  const filteredUsers = users?.filter(({ principal }) => {
    const principalText = principal.toString();
    return principalText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Status Management</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Status Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load user data'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Status Management</CardTitle>
        <CardDescription>
          Manage user roles and account status. Change roles between Owner, Admin, User, and Friend, or update account status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Users</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by Principal ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers && filteredUsers.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Principal ID</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Change Role</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Change Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(({ principal, role, status }) => {
                  const principalText = principal.toString();
                  const isRoleUpdating = setUserRoleMutation.isPending;
                  const isStatusUpdating = setUserStatusMutation.isPending;
                  
                  return (
                    <TableRow key={principalText}>
                      <TableCell className="font-mono text-xs max-w-xs truncate">
                        {principalText}
                      </TableCell>
                      <TableCell>
                        <UserRoleBadge role={role} size="sm" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={role}
                            onValueChange={(value) => handleRoleChange(principalText, value as UserRole)}
                            disabled={isRoleUpdating || isStatusUpdating}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={UserRole.owner}>Owner</SelectItem>
                              <SelectItem value={UserRole.admin}>Admin</SelectItem>
                              <SelectItem value={UserRole.user}>User</SelectItem>
                              <SelectItem value={UserRole.friend}>Friend</SelectItem>
                            </SelectContent>
                          </Select>
                          {isRoleUpdating && (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(status)}>
                          {getStatusLabel(status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={status}
                            onValueChange={(value) => handleStatusChange(principalText, value as UserStatus)}
                            disabled={isRoleUpdating || isStatusUpdating}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={UserStatus.active}>Active</SelectItem>
                              <SelectItem value={UserStatus.inactive}>Inactive</SelectItem>
                              <SelectItem value={UserStatus.suspended}>Suspended</SelectItem>
                              <SelectItem value={UserStatus.banned}>Banned</SelectItem>
                            </SelectContent>
                          </Select>
                          {isStatusUpdating && (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>
              {searchTerm ? 'No users found matching your search' : 'No users found'}
            </p>
          </div>
        )}

        {users && (
          <p className="text-sm text-muted-foreground">
            Total users: {users.length}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import React, { useState } from 'react';
import { useAddAdmin } from '../hooks/useAddAdmin';
import AdminList from './AdminList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminManagement() {
  const [principalId, setPrincipalId] = useState('');
  const addAdmin = useAddAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!principalId.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }
    try {
      await addAdmin.mutateAsync(principalId.trim());
      toast.success('Admin added successfully!');
      setPrincipalId('');
    } catch (err: any) {
      toast.error(`Failed to add admin: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border/50 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <UserPlus size={16} className="text-primary" />
          Add New Admin
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Principal ID</Label>
            <Input
              value={principalId}
              onChange={(e) => setPrincipalId(e.target.value)}
              placeholder="Enter principal ID..."
              className="bg-background border-border text-foreground text-sm font-mono"
            />
          </div>
          <Button
            type="submit"
            disabled={addAdmin.isPending || !principalId.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            {addAdmin.isPending ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground" />
                Adding...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus size={14} />
                Add Admin
              </span>
            )}
          </Button>
        </form>
      </div>
      <AdminList />
    </div>
  );
}

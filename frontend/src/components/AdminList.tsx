import React from 'react';
import { useAdminList } from '../hooks/useAdminList';
import { generateShortUserId } from '../utils/userIdGenerator';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertCircle } from 'lucide-react';

export default function AdminList() {
  const { data: admins = [], isLoading, error } = useAdminList();

  return (
    <div className="bg-card rounded-lg border border-border/50 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Shield size={16} className="text-primary" />
        Current Admins
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map(i => <Skeleton key={i} className="h-10 rounded-lg" />)}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircle size={14} />
          Failed to load admin list
        </div>
      ) : admins.length === 0 ? (
        <p className="text-xs text-muted-foreground">No admins configured</p>
      ) : (
        <div className="space-y-2">
          {(admins as string[]).map((principal) => {
            const shortId = generateShortUserId(principal);
            return (
              <div key={principal} className="flex items-center gap-2 p-2 bg-background/50 rounded-lg border border-border/20">
                <Shield size={12} className="text-primary shrink-0" />
                <span className="text-xs font-mono text-primary font-bold">{shortId}</span>
                <span className="text-xs text-muted-foreground truncate flex-1 font-mono">{principal}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

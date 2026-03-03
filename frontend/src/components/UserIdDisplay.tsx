import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { generateShortUserId } from '../utils/userIdGenerator';

export default function UserIdDisplay() {
  const { identity } = useInternetIdentity();
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [copiedPrincipal, setCopiedPrincipal] = useState(false);

  if (!identity) return null;

  const principalText = identity.getPrincipal().toString();
  const userId = generateShortUserId(principalText);

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    } catch (error) {
      console.error('Failed to copy user ID:', error);
    }
  };

  const handleCopyPrincipal = async () => {
    try {
      await navigator.clipboard.writeText(principalText);
      setCopiedPrincipal(true);
      setTimeout(() => setCopiedPrincipal(false), 2000);
    } catch (error) {
      console.error('Failed to copy principal ID:', error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* User ID Display */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">User ID</span>
          <span className="text-sm font-mono font-semibold">{userId}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleCopyUserId}
          title="Copy User ID"
        >
          {copiedUserId ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Principal ID Display */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-muted/30 rounded-md border border-border/50">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground/80">Principal</span>
          <span className="text-xs font-mono text-muted-foreground max-w-[200px] truncate" title={principalText}>
            {principalText}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleCopyPrincipal}
          title="Copy Principal ID"
        >
          {copiedPrincipal ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
}

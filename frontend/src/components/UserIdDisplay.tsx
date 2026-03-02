import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { generateShortUserId } from '../utils/userIdGenerator';
import { Copy, Check } from 'lucide-react';

export default function UserIdDisplay() {
  const { identity } = useInternetIdentity();
  const [copiedShort, setCopiedShort] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  if (!identity) return null;

  const principal = identity.getPrincipal().toString();
  const shortId = generateShortUserId(principal);

  const copyShort = async () => {
    await navigator.clipboard.writeText(shortId);
    setCopiedShort(true);
    setTimeout(() => setCopiedShort(false), 2000);
  };

  const copyFull = async () => {
    await navigator.clipboard.writeText(principal);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 bg-background/50 rounded px-2 py-1 border border-border/30">
        <span className="text-xs text-muted-foreground font-mono flex-1 truncate">
          ID: <span className="text-primary font-bold">{shortId}</span>
        </span>
        <button
          onClick={copyShort}
          className="text-muted-foreground hover:text-primary transition-colors shrink-0"
          title="Copy short ID"
        >
          {copiedShort ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
        </button>
      </div>
      <div className="flex items-center gap-1 bg-background/30 rounded px-2 py-1 border border-border/20">
        <span className="text-[10px] text-muted-foreground/60 font-mono flex-1 truncate">
          {principal.slice(0, 20)}...
        </span>
        <button
          onClick={copyFull}
          className="text-muted-foreground/60 hover:text-primary transition-colors shrink-0"
          title="Copy full principal"
        >
          {copiedFull ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
        </button>
      </div>
    </div>
  );
}

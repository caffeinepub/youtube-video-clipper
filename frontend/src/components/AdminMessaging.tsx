import React, { useState } from 'react';
import { useSendAdminMessage } from '../hooks/useSendAdminMessage';
import { generateShortUserId } from '../utils/userIdGenerator';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Send } from 'lucide-react';

export function AdminMessaging() {
  const { identity } = useInternetIdentity();
  const [toUserId, setToUserId] = useState('');
  const [body, setBody] = useState('');
  const { mutate: sendMessage, isPending } = useSendAdminMessage();

  const fromUserId = identity ? generateShortUserId(identity.getPrincipal().toString()) : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toUserId.trim() || !body.trim()) return;

    sendMessage(
      {
        toPrincipal: toUserId,
        toUserId: toUserId,
        body,
        fromUserId,
      },
      {
        onSuccess: () => {
          setToUserId('');
          setBody('');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Recipient User ID</label>
        <input
          type="text"
          value={toUserId}
          onChange={(e) => setToUserId(e.target.value)}
          placeholder="Enter user ID..."
          className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth"
        />
        {toUserId && (
          <p className="text-xs text-muted-foreground mt-1">To: {toUserId}</p>
        )}
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Message</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type your message..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !toUserId.trim() || !body.trim()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg cyberpunk-btn transition-smooth text-sm disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" />
        {isPending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

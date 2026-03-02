import React, { useState } from 'react';
import { useMyMessages } from '../hooks/useMyMessages';
import { useSendAdminMessage } from '../hooks/useSendAdminMessage';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { generateShortUserId } from '../utils/userIdGenerator';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { AdminMessage } from '../types/app';

export default function UserMessages() {
  const { identity } = useInternetIdentity();
  const myUserId = identity ? generateShortUserId(identity.getPrincipal().toString()) : '';
  const { data: messages = [], isLoading } = useMyMessages(myUserId);
  const { mutate: sendMessage, isPending } = useSendAdminMessage();
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [replyBody, setReplyBody] = useState('');

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyBody.trim()) return;
    sendMessage(
      {
        toPrincipal: selectedMessage.fromPrincipal,
        toUserId: selectedMessage.fromUserId,
        body: replyBody,
        fromUserId: myUserId,
      },
      {
        onSuccess: () => setReplyBody(''),
      }
    );
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

  if (selectedMessage) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedMessage(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to messages
        </button>

        <div className="glass-card rounded-xl p-4 border border-cyan-neon/10">
          <p className="text-xs text-muted-foreground mb-1">From: {selectedMessage.fromUserId}</p>
          <p className="text-sm text-foreground">{selectedMessage.body}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(new Date(Number(selectedMessage.sentAt) / 1_000_000), { addSuffix: true })}
          </p>
        </div>

        <form onSubmit={handleReply} className="space-y-2">
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Type your reply..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth resize-none"
          />
          <button
            type="submit"
            disabled={isPending || !replyBody.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg cyberpunk-btn transition-smooth text-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isPending ? 'Sending...' : 'Reply'}
          </button>
        </form>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <button
          key={msg.id}
          onClick={() => setSelectedMessage(msg)}
          className="w-full text-left glass-card rounded-xl p-4 border border-cyan-neon/10 hover:border-cyan-neon/30 transition-smooth"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">From: {msg.fromUserId}</p>
              <p className="text-sm text-foreground truncate mt-0.5">{msg.body}</p>
            </div>
            <p className="text-xs text-muted-foreground shrink-0">
              {formatDistanceToNow(new Date(Number(msg.sentAt) / 1_000_000), { addSuffix: true })}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

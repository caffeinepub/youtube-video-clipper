import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useMyMessages } from '../hooks/useMyMessages';
import { generateShortUserId } from '../utils/userIdGenerator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, ArrowLeft, Send, Inbox } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';

interface Message {
  id: string;
  fromPrincipal: string;
  toPrincipal: string;
  fromUserId: string;
  toUserId: string;
  body: string;
  sentAt: bigint | number;
}

export default function UserMessages() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const { data: messages = [], isLoading, refetch } = useMyMessages();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!identity) return null;

  const principal = identity.getPrincipal().toString();
  const shortId = generateShortUserId(principal);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedMessage || !actor) return;
    setIsSending(true);
    try {
      await (actor as any).replyToMessage?.(selectedMessage.id, replyText.trim());
      toast.success('Reply sent!');
      setReplyText('');
      refetch();
    } catch (err) {
      toast.error('Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (ts: bigint | number) => {
    const ms = typeof ts === 'bigint' ? Number(ts) / 1_000_000 : Number(ts);
    const date = new Date(ms);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return date.toLocaleDateString();
  };

  if (selectedMessage) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedMessage(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to inbox
        </button>

        <div className="bg-card rounded-xl border border-border/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                From: <span className="text-primary font-mono">{selectedMessage.fromUserId}</span>
              </p>
              <p className="text-xs text-muted-foreground">{formatTime(selectedMessage.sentAt)}</p>
            </div>
          </div>
          <p className="text-foreground whitespace-pre-wrap">{selectedMessage.body}</p>
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Reply</h3>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            className="bg-background border-border text-foreground resize-none"
            rows={4}
          />
          <Button
            onClick={handleReply}
            disabled={isSending || !replyText.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={16} />
                Send Reply
              </span>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Inbox size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No messages yet</p>
          <p className="text-sm mt-1">Messages from admins will appear here</p>
        </div>
      ) : (
        messages.map((msg: Message) => (
          <button
            key={msg.id}
            onClick={() => setSelectedMessage(msg)}
            className="w-full text-left bg-card rounded-xl border border-border/50 p-4 hover:border-primary/40 hover:bg-card/80 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <MessageSquare size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-primary font-mono">{msg.fromUserId}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(msg.sentAt)}</p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 line-clamp-2 flex-1">{msg.body}</p>
            </div>
          </button>
        ))
      )}
    </div>
  );
}

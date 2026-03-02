import React, { useState } from 'react';
import { useSendAdminMessage } from '../hooks/useSendAdminMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, MessageSquare } from 'lucide-react';
import { generateShortUserId } from '../utils/userIdGenerator';

export function AdminMessaging() {
  const [toPrincipal, setToPrincipal] = useState('');
  const [body, setBody] = useState('');
  const sendMessage = useSendAdminMessage();

  const toUserId = toPrincipal.trim() ? generateShortUserId(toPrincipal.trim()) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toPrincipal.trim() || !body.trim()) return;
    await sendMessage.mutateAsync({
      toPrincipal: toPrincipal.trim(),
      toUserId,
      body: body.trim(),
    });
    setToPrincipal('');
    setBody('');
  };

  return (
    <div className="bg-card rounded-lg border border-border/50 p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <MessageSquare size={16} className="text-primary" />
        Send Message to User
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Recipient Principal ID</Label>
          <Input
            value={toPrincipal}
            onChange={(e) => setToPrincipal(e.target.value)}
            placeholder="Enter principal ID..."
            className="bg-background border-border text-foreground text-sm font-mono"
          />
          {toUserId && (
            <p className="text-xs text-muted-foreground">
              User ID: <span className="text-primary font-mono">{toUserId}</span>
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Message</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your message..."
            className="bg-background border-border text-foreground resize-none text-sm"
            rows={4}
          />
        </div>
        <Button
          type="submit"
          disabled={sendMessage.isPending || !toPrincipal.trim() || !body.trim()}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          {sendMessage.isPending ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground" />
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send size={14} />
              Send Message
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}

export default AdminMessaging;

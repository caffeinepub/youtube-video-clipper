import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSendAdminMessage } from '../hooks/useSendAdminMessage';

export default function AdminMessaging() {
  const [toUserId, setToUserId] = useState('');
  const [body, setBody] = useState('');
  const { mutate: sendMessage, isPending } = useSendAdminMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toUserId.trim() || !body.trim()) return;
    sendMessage(
      { toUserId: toUserId.trim(), body: body.trim() },
      {
        onSuccess: () => {
          setToUserId('');
          setBody('');
        },
      }
    );
  };

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-indigo-400" />
        <h3 className="text-base font-semibold text-white font-display">Message User</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">User Principal ID</Label>
          <Input
            value={toUserId}
            onChange={(e) => setToUserId(e.target.value)}
            placeholder="Enter user principal ID..."
            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-indigo-500/60 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Message</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            rows={3}
            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-indigo-500/60 text-sm resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || !toUserId.trim() || !body.trim()}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white gap-2"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            <>
              <Send size={14} />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

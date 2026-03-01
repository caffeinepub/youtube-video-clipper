import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { generateShortUserId } from '../utils/userIdGenerator';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function AdminMessaging() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [toPrincipal, setToPrincipal] = useState('');
  const [body, setBody] = useState('');

  const principalStr = identity?.getPrincipal().toString() ?? '';
  const fromUserId = principalStr ? generateShortUserId(principalStr) : '';

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Not connected to backend');
      if (!toPrincipal.trim()) throw new Error('Recipient principal is required');
      if (!body.trim()) throw new Error('Message body is required');

      const toUserId = generateShortUserId(toPrincipal.trim());

      return actor.sendMessage(
        toPrincipal.trim(),
        toUserId,
        body.trim(),
        fromUserId,
      );
    },
    onSuccess: () => {
      toast.success('Message sent successfully');
      setToPrincipal('');
      setBody('');
      queryClient.invalidateQueries({ queryKey: ['myMessages'] });
    },
    onError: (err: Error) => {
      toast.error('Failed to send message', { description: err.message });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-indigo-400" />
        <h3 className="text-base font-semibold text-white font-display">Message User</h3>
      </div>

      {/* Sender info */}
      <div className="bg-white/5 rounded-lg px-3 py-2 text-sm">
        <span className="text-muted-foreground">Sending as User ID: </span>
        <span className="font-mono font-medium text-indigo-300">{fromUserId || '—'}</span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Recipient Principal ID</Label>
          <Input
            value={toPrincipal}
            onChange={(e) => setToPrincipal(e.target.value)}
            placeholder="Enter recipient's principal ID..."
            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-indigo-500/60 text-sm font-mono"
          />
          {toPrincipal.trim() && (
            <p className="text-xs text-muted-foreground">
              Recipient User ID:{' '}
              <span className="font-mono font-medium text-indigo-300">
                {generateShortUserId(toPrincipal.trim())}
              </span>
            </p>
          )}
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
          onClick={() => sendMutation.mutate()}
          disabled={sendMutation.isPending || !toPrincipal.trim() || !body.trim()}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white gap-2"
        >
          {sendMutation.isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={14} />
              Send Message
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

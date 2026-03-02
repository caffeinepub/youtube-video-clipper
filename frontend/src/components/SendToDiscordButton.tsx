import React, { useState } from 'react';
import { MessageSquare, Send, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface SendToDiscordButtonProps {
  clip: {
    title: string;
    videoId?: string;
    startTime: number;
    endTime: number;
    score: number;
  };
  compact?: boolean;
}

export default function SendToDiscordButton({ clip, compact = false }: SendToDiscordButtonProps) {
  const [open, setOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!webhookUrl.trim() || !webhookUrl.includes('discord.com/api/webhooks')) {
      toast.error('Please enter a valid Discord webhook URL');
      return;
    }

    setSending(true);
    try {
      const clipUrl = clip.videoId ? `https://youtu.be/${clip.videoId}?t=${clip.startTime}` : 'N/A';
      const payload = {
        embeds: [
          {
            title: `🎮 ${clip.title}`,
            description: `Check out this epic gaming clip!`,
            color: 0x00f2ff,
            fields: [
              { name: 'Timestamp', value: `${clip.startTime}s – ${clip.endTime}s`, inline: true },
              { name: 'Viral Score', value: `⚡ ${clip.score.toFixed(0)}`, inline: true },
              { name: 'Link', value: clipUrl, inline: false },
            ],
            footer: { text: 'Shared via Beast Clipping' },
          },
        ],
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 204) {
        toast.success('Clip sent to Discord! 🎮');
        setOpen(false);
        setWebhookUrl('');
      } else {
        toast.error('Failed to send to Discord. Check your webhook URL.');
      }
    } catch {
      toast.error('Failed to send to Discord. Check your webhook URL.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 transition-smooth"
      >
        <MessageSquare className="w-3 h-3" />
        {!compact && 'Discord'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative glass-card rounded-2xl border border-indigo-500/30 p-6 w-full max-w-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron text-sm text-indigo-300">SEND TO DISCORD</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Enter your Discord webhook URL to share this clip directly to a channel.
            </p>

            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-indigo-500/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-indigo-400 transition-smooth mb-4"
            />

            <button
              onClick={handleSend}
              disabled={sending || !webhookUrl.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 transition-smooth disabled:opacity-50 text-sm font-semibold"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Sending...' : 'Send to Discord'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

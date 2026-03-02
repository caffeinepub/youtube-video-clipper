import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { SiX } from 'react-icons/si';
import { toast } from 'sonner';

interface ShareClipButtonProps {
  videoId: string;
  startTime: number;
  title: string;
  compact?: boolean;
}

export default function ShareClipButton({ videoId, startTime, title, compact = false }: ShareClipButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const clipUrl = `https://youtu.be/${videoId}?t=${startTime}`;
  const tweetText = encodeURIComponent(`🎮 Check out this epic clip: "${title}" ${clipUrl} #BeastClipping #Gaming`);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs cyberpunk-btn px-2 py-1 rounded-lg transition-smooth"
      >
        <Share2 className="w-3 h-3" />
        {!compact && 'Share'}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-8 right-0 z-50 glass-card rounded-xl border border-cyan-neon/30 p-3 w-52 animate-fade-in-up">
            <p className="text-xs font-orbitron text-cyan-neon mb-2">SHARE CLIP</p>
            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(clipUrl, 'Link')}
                className="w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-cyan-neon/5 hover:bg-cyan-neon/10 border border-cyan-neon/20 transition-smooth text-foreground"
              >
                {copied ? <Check className="w-3 h-3 text-cyan-neon" /> : <Copy className="w-3 h-3" />}
                Copy Link
              </button>
              <a
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-black/30 hover:bg-black/50 border border-white/10 transition-smooth text-foreground"
                onClick={() => setOpen(false)}
              >
                <SiX className="w-3 h-3" />
                Share to X
              </a>
              <button
                onClick={() => {
                  copyToClipboard(`Check out this epic clip: ${clipUrl}`, 'Discord message');
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-500/20 transition-smooth text-foreground"
              >
                <span className="text-indigo-400 font-bold text-xs">DC</span>
                Copy for Discord
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Info } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CaptionEditorProps {
  initialCaption?: string;
  onCaptionChange?: (caption: string) => void;
}

const MAX_CHARS = 500;

const MARKDOWN_HINTS = [
  { syntax: '**text**', result: 'Bold' },
  { syntax: '*text*', result: 'Italic' },
  { syntax: '#hashtag', result: 'Hashtag' },
  { syntax: '@mention', result: 'Mention' },
];

export default function CaptionEditor({ initialCaption = '', onCaptionChange }: CaptionEditorProps) {
  const [caption, setCaption] = useState(initialCaption);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setCaption(val);
      onCaptionChange?.(val);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charPercent = (caption.length / MAX_CHARS) * 100;
  const charColor = charPercent > 90 ? 'text-red-400' : charPercent > 70 ? 'text-yellow-400' : 'text-muted-foreground';

  return (
    <div className="glass-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-white font-semibold text-sm">AI Caption Editor</h3>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-white transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border-white/10 p-3 max-w-xs">
                <p className="text-xs font-semibold mb-2 text-white">Formatting Tips</p>
                <div className="space-y-1">
                  {MARKDOWN_HINTS.map(hint => (
                    <div key={hint.syntax} className="flex items-center gap-2 text-xs">
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300">{hint.syntax}</code>
                      <span className="text-muted-foreground">→ {hint.result}</span>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-7 w-7 text-muted-foreground hover:text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Textarea */}
      <Textarea
        value={caption}
        onChange={handleChange}
        placeholder="Write your caption here... Use #hashtags, @mentions, and emojis 🔥"
        className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 resize-none focus:border-indigo-500/50 focus:ring-indigo-500/20 min-h-[120px] text-sm"
        rows={5}
      />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {['🔥', '💯', '🚀', '⚡', '🎯'].map(emoji => (
            <button
              key={emoji}
              onClick={() => {
                if (caption.length < MAX_CHARS) {
                  const newCaption = caption + emoji;
                  setCaption(newCaption);
                  onCaptionChange?.(newCaption);
                }
              }}
              className="text-base hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
        <span className={`text-xs font-mono ${charColor}`}>
          {caption.length}/{MAX_CHARS}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            charPercent > 90 ? 'bg-red-400' : charPercent > 70 ? 'bg-yellow-400' : 'bg-indigo-500'
          }`}
          style={{ width: `${charPercent}%` }}
        />
      </div>
    </div>
  );
}

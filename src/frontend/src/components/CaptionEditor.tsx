import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy, Flame, Info, Sparkles } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface CaptionEditorProps {
  initialCaption?: string;
  onCaptionChange?: (caption: string) => void;
}

const MAX_CHARS = 500;

const MARKDOWN_HINTS = [
  { syntax: "**text**", result: "Bold" },
  { syntax: "*text*", result: "Italic" },
  { syntax: "#hashtag", result: "Hashtag" },
  { syntax: "@mention", result: "Mention" },
];

export default function CaptionEditor({
  initialCaption = "",
  onCaptionChange,
}: CaptionEditorProps) {
  const [caption, setCaption] = useState(initialCaption);
  const [copied, setCopied] = useState(false);
  const [neonStyle, setNeonStyle] = useState(false);

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

  const handleBurnIn = () => {
    toast.success("🔥 Captions will be burned into export!", {
      description: neonStyle
        ? "Neon caption style applied"
        : "Standard caption style applied",
    });
  };

  const charPercent = (caption.length / MAX_CHARS) * 100;
  const charColor =
    charPercent > 90
      ? "text-red-400"
      : charPercent > 70
        ? "text-yellow-400"
        : "text-muted-foreground";

  return (
    <div className="glass-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-white font-semibold text-sm">
            AI Caption Editor
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border-white/10 p-3 max-w-xs">
                <p className="text-xs font-semibold mb-2 text-white">
                  Formatting Tips
                </p>
                <div className="space-y-1">
                  {MARKDOWN_HINTS.map((hint) => (
                    <div
                      key={hint.syntax}
                      className="flex items-center gap-2 text-xs"
                    >
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary">
                        {hint.syntax}
                      </code>
                      <span className="text-muted-foreground">
                        → {hint.result}
                      </span>
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
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Neon Caption Toggle */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/3 border border-white/8">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">⚡</span>
          <Label className="text-xs text-muted-foreground cursor-pointer">
            {neonStyle ? (
              <span
                className="font-bold"
                style={{
                  color: "#ffe600",
                  textShadow:
                    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                NEON CAPTION ACTIVE
              </span>
            ) : (
              "Neon Caption Style"
            )}
          </Label>
        </div>
        <Switch
          checked={neonStyle}
          onCheckedChange={setNeonStyle}
          className="data-[state=checked]:bg-yellow-500"
          data-ocid="caption.switch"
        />
      </div>

      {/* Caption preview when neon style on */}
      {neonStyle && caption && (
        <div className="relative rounded-lg overflow-hidden bg-black p-3">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.9) 100%)",
            }}
          />
          <p
            className="text-center text-sm font-black relative z-10"
            style={{
              color: "#ffe600",
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 0 10px #ffe600",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {caption.slice(0, 80)}
            {caption.length > 80 && "…"}
          </p>
        </div>
      )}

      {/* Textarea */}
      <Textarea
        value={caption}
        onChange={handleChange}
        placeholder="Write your caption here... Use #hashtags, @mentions, and emojis 🔥"
        className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 resize-none focus:border-primary/50 focus:ring-primary/20 min-h-[100px] text-sm"
        rows={4}
        data-ocid="caption.textarea"
      />

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {["🔥", "💯", "🚀", "⚡", "🎯"].map((emoji) => (
            <button
              type="button"
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
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono ${charColor}`}>
            {caption.length}/{MAX_CHARS}
          </span>
          <button
            type="button"
            onClick={handleBurnIn}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 hover:bg-orange-500/25 transition-all font-medium"
            data-ocid="caption.button"
          >
            <Flame className="w-3 h-3" />
            Burn In
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            charPercent > 90
              ? "bg-red-400"
              : charPercent > 70
                ? "bg-yellow-400"
                : "bg-primary"
          }`}
          style={{ width: `${charPercent}%` }}
        />
      </div>
    </div>
  );
}

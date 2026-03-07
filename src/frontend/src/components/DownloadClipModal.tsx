import { Button } from "@/components/ui/button";
import { Check, Copy, Download, ExternalLink, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface DownloadClipModalProps {
  open: boolean;
  onClose: () => void;
  videoId: string;
  startTime: number;
  endTime: number;
  title?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function DownloadClipModal({
  open,
  onClose,
  videoId,
  startTime,
  endTime,
  title,
}: DownloadClipModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(startTime)}`;
  const duration = endTime - startTime;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(youtubeWatchUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleWatchOnYouTube = () => {
    window.open(youtubeWatchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="download.modal"
    >
      <div
        className="bg-[#0d1020] border border-primary/20 rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Download className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">
                Download Clip
              </h3>
              <p className="text-muted-foreground text-xs">{title || "Clip"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
            data-ocid="download.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clip info */}
        <div className="bg-white/5 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Start</span>
            <span className="text-white font-mono">
              {formatTime(startTime)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">End</span>
            <span className="text-white font-mono">{formatTime(endTime)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Duration</span>
            <span className="text-white font-mono">{duration}s</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleCopyLink}
            className="w-full h-9 text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40"
            variant="outline"
            data-ocid="download.button"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-2" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-2" />
                Copy Clip Link
              </>
            )}
          </Button>

          <Button
            onClick={handleWatchOnYouTube}
            className="w-full h-9 text-xs"
            variant="outline"
            data-ocid="download.secondary_button"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2" />
            Watch on YouTube at Timestamp
          </Button>
        </div>

        <p className="text-muted-foreground text-[10px] text-center leading-relaxed">
          YouTube clips can be saved from the YouTube app by tapping "Save" or
          using YouTube's built-in download feature (YouTube Premium).
        </p>
      </div>
    </div>
  );
}

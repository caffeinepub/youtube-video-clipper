import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

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
  const { actor } = useActor();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!open) return null;

  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(startTime)}`;
  const duration = endTime - startTime;

  const handleDownload = async () => {
    if (!actor) {
      toast.error("Not connected to backend. Please refresh and try again.");
      return;
    }
    setIsDownloading(true);
    try {
      const url = await actor.generateDownloadVideoUrl(
        videoId,
        BigInt(Math.floor(startTime)),
        BigInt(Math.floor(endTime)),
      );

      if (!url || url.trim() === "") {
        throw new Error("empty_url");
      }

      // Trigger download via a temporary anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "clip"}-${videoId}-${Math.floor(startTime)}s.mp4`;
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Download started!");
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error && err.message === "empty_url"
          ? "Download not available for this clip. Try watching on YouTube."
          : "Download not available for this clip. Try watching on YouTube.";
      toast.error(msg);
    } finally {
      setIsDownloading(false);
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
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full h-9 text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40"
            variant="outline"
            data-ocid="download.button"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Preparing Download…
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 mr-2" />
                Download Clip to Device
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
          Downloads are generated from the clip's source video. If download
          fails, use "Watch on YouTube" to access the clip.
        </p>
      </div>
    </div>
  );
}

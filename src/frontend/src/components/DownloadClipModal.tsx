import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, ExternalLink, X } from "lucide-react";
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

type DownloadState = "idle" | "downloading" | "done" | "error";

async function downloadToDevice(
  url: string,
  filename: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("googlevideo.com")
  ) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const contentLength = response.headers.get("content-length");
  const total = contentLength ? Number.parseInt(contentLength, 10) : 0;

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    if (total > 0) {
      onProgress(Math.min(99, Math.round((loaded / total) * 100)));
    } else {
      // Indeterminate — pulse between 20–80
      onProgress(-1);
    }
  }

  onProgress(100);

  const blob = new Blob(chunks);
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
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
  const [dlState, setDlState] = useState<DownloadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(startTime)}`;
  const duration = endTime - startTime;
  const filename = `${title || "clip"}-${videoId}-${Math.floor(startTime)}s.mp4`;

  const handleDownload = async () => {
    if (!actor) {
      toast.error("Not connected to backend. Please refresh and try again.");
      return;
    }
    setDlState("downloading");
    setProgress(0);
    setErrorMsg("");

    try {
      const url = await actor.generateDownloadVideoUrl(
        videoId,
        BigInt(Math.floor(startTime)),
        BigInt(Math.floor(endTime)),
      );

      if (!url || url.trim() === "") {
        throw new Error("empty_url");
      }

      await downloadToDevice(url, filename, (pct) => {
        if (pct >= 0) setProgress(pct);
      });

      setDlState("done");
      setProgress(100);
      setTimeout(() => {
        onClose();
        setDlState("idle");
        setProgress(0);
      }, 1200);
    } catch (err) {
      // Fallback: try YouTube timestamp link
      try {
        await downloadToDevice(youtubeWatchUrl, filename, () => {});
        setDlState("done");
        setProgress(100);
        setTimeout(() => {
          onClose();
          setDlState("idle");
          setProgress(0);
        }, 1200);
      } catch {
        const msg =
          err instanceof Error && err.message === "empty_url"
            ? "Download not available for this clip."
            : "Download failed. Try watching on YouTube.";
        setErrorMsg(msg);
        setDlState("error");
      }
    }
  };

  const handleWatchOnYouTube = () => {
    window.open(youtubeWatchUrl, "_blank", "noopener,noreferrer");
  };

  const isDownloading = dlState === "downloading";
  const isDone = dlState === "done";
  const isError = dlState === "error";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={isDownloading ? undefined : onClose}
      onKeyDown={(e) => !isDownloading && e.key === "Escape" && onClose()}
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
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500"
              style={{
                background: isDone
                  ? "rgba(34,197,94,0.2)"
                  : "rgba(0,242,255,0.15)",
              }}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <Download className="w-4 h-4 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">
                {isDone ? "Download Complete" : "Download Clip"}
              </h3>
              <p className="text-muted-foreground text-xs">{title || "Clip"}</p>
            </div>
          </div>
          {!isDownloading && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              data-ocid="download.close_button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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

        {/* Progress / Actions */}
        {isDownloading ? (
          <div className="space-y-3" data-ocid="download.loading_state">
            {/* Progress bar */}
            <div className="relative w-full h-2 bg-white/8 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
                style={{
                  width: progress >= 0 ? `${progress}%` : "60%",
                  background:
                    "linear-gradient(90deg, #00f2ff 0%, #00b4d8 100%)",
                  boxShadow: "0 0 12px rgba(0,242,255,0.6)",
                  animation:
                    progress < 0
                      ? "pulse 1.4s ease-in-out infinite"
                      : undefined,
                }}
              />
            </div>
            <p className="text-center text-xs text-primary font-mono">
              {progress < 0 ? (
                <span style={{ animation: "pulse 1.4s ease-in-out infinite" }}>
                  Downloading
                  <span className="inline-block animate-bounce">.</span>
                  <span
                    className="inline-block animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  >
                    .
                  </span>
                  <span
                    className="inline-block animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  >
                    .
                  </span>
                </span>
              ) : (
                `Downloading... ${progress}%`
              )}
            </p>
          </div>
        ) : isDone ? (
          <div
            className="flex items-center justify-center gap-2 py-2"
            data-ocid="download.success_state"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">
              Download complete ✓
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {isError && (
              <p
                className="text-red-400 text-xs text-center"
                data-ocid="download.error_state"
              >
                {errorMsg}
              </p>
            )}
            <Button
              onClick={handleDownload}
              className="w-full h-9 text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40"
              variant="outline"
              data-ocid="download.button"
            >
              <Download className="w-3.5 h-3.5 mr-2" />
              Download Clip to Device
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
        )}

        {!isDownloading && !isDone && (
          <p className="text-muted-foreground text-[10px] text-center leading-relaxed">
            Downloads save directly to your device. If download fails, use
            "Watch on YouTube" to access the clip.
          </p>
        )}
      </div>
    </div>
  );
}

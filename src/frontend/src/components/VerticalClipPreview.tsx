import { Clock, Film, Play, Zap } from "lucide-react";
import React from "react";
import type { VideoClip } from "../backend";
import ViralScoreBadge from "./ViralScoreBadge";

interface VerticalClipPreviewProps {
  clip?: VideoClip | null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function VerticalClipPreview({
  clip,
}: VerticalClipPreviewProps) {
  if (!clip) {
    return (
      <div
        className="glass-card flex flex-col items-center justify-center p-4"
        style={{ aspectRatio: "9/16", maxHeight: "480px" }}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Film className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm font-medium text-center">
          No clip selected
        </p>
        <p className="text-muted-foreground/60 text-xs text-center mt-1">
          Select a clip to preview
        </p>
      </div>
    );
  }

  const startTime = Number(clip.startTime);
  const endTime = Number(clip.endTime);
  const duration = endTime - startTime;

  // Extract YouTube video ID from URL
  const videoIdMatch = clip.videoUrl.match(
    /(?:v=|youtu\.be\/|embed\/)([^&?/]+)/,
  );
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : clip.thumbnailUrl;

  return (
    <div
      className="glass-card overflow-hidden"
      style={{ aspectRatio: "9/16", maxHeight: "480px" }}
    >
      {/* Thumbnail / Preview */}
      <div className="relative w-full h-full flex flex-col">
        {/* Video Thumbnail */}
        <div className="relative flex-1 bg-black overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={clip.title}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <Play className="w-12 h-12 text-indigo-400" />
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-indigo-500/80 backdrop-blur-sm flex items-center justify-center indigo-glow">
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Viral Score Badge */}
          <div className="absolute top-3 right-3">
            <ViralScoreBadge score={clip.score} />
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span className="text-white text-xs font-mono">{duration}s</span>
          </div>
        </div>

        {/* Info Panel */}
        <div className="p-3 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
            {clip.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono text-indigo-400">
              {formatTime(startTime)}
            </span>
            <span>→</span>
            <span className="font-mono text-indigo-400">
              {formatTime(endTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

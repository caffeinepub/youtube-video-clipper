import React, { useState } from 'react';
import { VideoClip } from '../backend';
import { useDownloadClip } from '../hooks/useDownloadClip';
import { usePostToYouTube } from '../hooks/usePostToYouTube';
import { generateShortUserId } from '../utils/userIdGenerator';
import ViralScoreBadge from './ViralScoreBadge';
import { Button } from '@/components/ui/button';
import { Download, Youtube, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ClipCardProps {
  clip: VideoClip;
  onDelete?: (clipId: string) => void;
  isDeleting?: boolean;
  isAdminView?: boolean;
  ownerPrincipal?: string;
}

function CopyPrincipalButton({ principal }: { principal: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(principal);
      setCopied(true);
      toast.success('Principal ID copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-1 p-0.5 rounded hover:bg-white/10 transition-colors text-white/50 hover:text-white/80"
      title="Copy principal ID"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

export default function ClipCard({
  clip,
  onDelete,
  isDeleting,
  isAdminView = false,
  ownerPrincipal,
}: ClipCardProps) {
  const downloadMutation = useDownloadClip();
  const postToYouTubeMutation = usePostToYouTube();

  const startSec = Number(clip.startTime);
  const endSec = Number(clip.endTime);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const videoId = (() => {
    try {
      const url = new URL(clip.videoUrl);
      return url.searchParams.get('v') || url.pathname.split('/').pop() || clip.videoUrl;
    } catch {
      return clip.videoUrl;
    }
  })();

  const thumbnailUrl =
    clip.thumbnailUrl ||
    (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '');

  const handleDownload = () => {
    downloadMutation.mutate({
      videoId,
      startTime: startSec,
      endTime: endSec,
      title: clip.title,
    });
  };

  const handlePostToYouTube = () => {
    postToYouTubeMutation.mutate({
      videoId,
      startTimestamp: BigInt(startSec),
      endTimestamp: BigInt(endSec),
      title: clip.title,
    });
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-200 shadow-sm hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={clip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Youtube className="w-8 h-8" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <ViralScoreBadge score={clip.score} />
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
          {formatTime(startSec)} – {formatTime(endSec)}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">
          {clip.title}
        </h3>

        {/* Admin: show owner principal */}
        {isAdminView && ownerPrincipal && (
          <div className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1">
            <span className="text-xs text-muted-foreground font-mono truncate max-w-[160px]" title={ownerPrincipal}>
              Owner: {ownerPrincipal.slice(0, 12)}…
            </span>
            <CopyPrincipalButton principal={ownerPrincipal} />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
            className="flex-1 text-xs h-8"
          >
            {downloadMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Download className="w-3 h-3 mr-1" />
            )}
            Download
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePostToYouTube}
            disabled={postToYouTubeMutation.isPending}
            className="flex-1 text-xs h-8 border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            {postToYouTubeMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Youtube className="w-3 h-3 mr-1" />
            )}
            Post
          </Button>

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(clip.id)}
              disabled={isDeleting}
              className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
            >
              {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : '✕'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Trash2, Download, Youtube, Clock } from 'lucide-react';
import { VideoClip } from '../backend';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDownloadClip } from '../hooks/useDownloadClip';
import { usePostToYouTube } from '../hooks/usePostToYouTube';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';
import ViralScoreBadge from './ViralScoreBadge';

interface ClipCardProps {
  clip: VideoClip;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

function formatTime(seconds: bigint): string {
  const s = Number(seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, '0')}`;
}

export default function ClipCard({ clip, onDelete, isDeleting }: ClipCardProps) {
  const { mutate: downloadClip, isPending: isDownloading } = useDownloadClip();
  const { mutate: postToYouTube, isPending: isPosting } = usePostToYouTube();
  const { channelStatus } = useYouTubeChannel();

  const isConnected = channelStatus?.isConnected ?? false;
  const duration = Number(clip.endTime) - Number(clip.startTime);

  const handleDownload = () => {
    // Extract video ID from URL if it's a full YouTube URL, otherwise use as-is
    const videoIdMatch = clip.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : clip.videoUrl;

    downloadClip({
      videoId,
      startTimestamp: clip.startTime,
      endTimestamp: clip.endTime,
      title: clip.title,
    });
  };

  const handlePost = () => {
    const videoIdMatch = clip.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : clip.videoUrl;

    postToYouTube({
      videoId,
      startTimestamp: clip.startTime,
      endTimestamp: clip.endTime,
      title: clip.title,
    });
  };

  return (
    <TooltipProvider>
      <div className="glass-card rounded-xl p-3 border border-white/5 hover:border-indigo-500/20 transition-all duration-200">
        <div className="flex gap-3">
          {/* Thumbnail */}
          <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-white/5 border border-white/5">
            {clip.thumbnailUrl ? (
              <img
                src={clip.thumbnailUrl}
                alt={clip.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Youtube size={16} className="text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-white truncate leading-tight">{clip.title}</p>
              <ViralScoreBadge score={clip.score} />
            </div>

            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={11} />
                <span>{formatTime(clip.startTime)} – {formatTime(clip.endTime)}</span>
              </div>
              <span className="text-xs text-indigo-400 font-medium">{duration}s</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 mt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                disabled={isDownloading}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-white hover:bg-white/10 gap-1"
              >
                {isDownloading ? (
                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download size={12} />
                )}
                Download
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handlePost}
                      disabled={isPosting || !isConnected}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-red-400 hover:bg-red-500/10 gap-1 disabled:opacity-40"
                    >
                      {isPosting ? (
                        <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Youtube size={12} />
                      )}
                      Post
                    </Button>
                  </span>
                </TooltipTrigger>
                {!isConnected && (
                  <TooltipContent className="bg-dark-800 border-white/10 text-white text-xs">
                    Connect your YouTube channel first
                  </TooltipContent>
                )}
              </Tooltip>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(clip.id)}
                disabled={isDeleting}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1 ml-auto"
              >
                {isDeleting ? (
                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

import React, { useState } from 'react';
import { Download, Trash2, Youtube, ExternalLink, Clock } from 'lucide-react';
import ViralScoreBadge from './ViralScoreBadge';
import { useDownloadClip } from '../hooks/useDownloadClip';
import { toast } from 'sonner';
import ExportFormatDropdown, { ExportFormat } from './ExportFormatDropdown';
import ShareClipButton from './ShareClipButton';
import SendToDiscordButton from './SendToDiscordButton';
import MintToGalleryButton from './MintToGalleryButton';
import { isMinted } from '../hooks/useMintedCollectibles';

interface ClipCardProps {
  clip: {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    startTime: number;
    endTime: number;
    score: number;
    createdAt?: any;
  };
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  isAdminView?: boolean;
  ownerPrincipal?: string;
}

function extractVideoId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : '';
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ClipCard({ clip, onDelete, isDeleting, isAdminView, ownerPrincipal }: ClipCardProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('mp4');
  const { downloadClip, isDownloading } = useDownloadClip();
  const videoId = extractVideoId(clip.videoUrl);
  const mintedAlready = isMinted(clip.id);

  const handleDownload = () => {
    downloadClip({ clipId: clip.id, format: exportFormat });
    toast.success(`Exporting as ${exportFormat.toUpperCase()}...`);
  };

  const handleYouTubeOpen = () => {
    if (videoId) {
      window.open(`https://youtu.be/${videoId}?t=${clip.startTime}`, '_blank');
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-cyan-neon/15 hover:border-cyan-neon/40 transition-smooth group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-purple-deep overflow-hidden">
        {clip.thumbnailUrl ? (
          <img
            src={clip.thumbnailUrl}
            alt={clip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Youtube className="w-12 h-12 text-cyan-neon/20" />
          </div>
        )}

        {/* Score Badge */}
        <div className="absolute top-2 left-2">
          <ViralScoreBadge score={clip.score} />
        </div>

        {/* Minted Badge */}
        {mintedAlready && (
          <div className="absolute top-2 right-2">
            <span className="flex items-center gap-1 text-xs font-orbitron px-2 py-0.5 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 text-cyan-neon">
              ✓ MINTED
            </span>
          </div>
        )}

        {/* Duration overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs bg-black/60 px-2 py-0.5 rounded-full text-white">
          <Clock className="w-3 h-3" />
          {formatTime(clip.startTime)} – {formatTime(clip.endTime)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm truncate mb-1">{clip.title}</h3>

        {isAdminView && ownerPrincipal && (
          <p className="text-xs text-muted-foreground font-mono truncate mb-2">{ownerPrincipal}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-wrap mt-3">
          {/* Export + Download */}
          <ExportFormatDropdown value={exportFormat} onChange={setExportFormat} />
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1 text-xs cyberpunk-btn px-2 py-1.5 rounded-lg transition-smooth disabled:opacity-50"
          >
            <Download className="w-3 h-3" />
          </button>

          {/* Share */}
          {videoId && (
            <ShareClipButton
              videoId={videoId}
              startTime={clip.startTime}
              title={clip.title}
              compact
            />
          )}

          {/* YouTube */}
          {videoId && (
            <button
              onClick={handleYouTubeOpen}
              className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-400 transition-smooth"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          {/* Discord */}
          <SendToDiscordButton
            clip={{
              title: clip.title,
              videoId,
              startTime: clip.startTime,
              endTime: clip.endTime,
              score: clip.score,
            }}
            compact
          />

          {/* Mint */}
          <MintToGalleryButton
            clip={{
              id: clip.id,
              videoId,
              title: clip.title,
              thumbnailUrl: clip.thumbnailUrl,
              startTime: clip.startTime,
              endTime: clip.endTime,
              score: clip.score,
            }}
            compact
          />

          {/* Delete */}
          {onDelete && (
            <button
              onClick={() => onDelete(clip.id)}
              disabled={isDeleting}
              className="ml-auto flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/40 border border-red-500/20 text-red-400 transition-smooth disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

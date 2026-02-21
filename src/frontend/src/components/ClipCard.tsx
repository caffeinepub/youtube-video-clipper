import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, Clock, Loader2, Youtube, CheckCircle2, ExternalLink, Download, AlertCircle } from 'lucide-react';
import ViralScoreBadge from './ViralScoreBadge';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';
import { usePostToYouTube } from '../hooks/usePostToYouTube';
import { useDownloadClip } from '../hooks/useDownloadClip';
import type { VideoClip } from '../backend';

interface ClipCardProps {
  clip: VideoClip;
  onClick: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isSelected: boolean;
}

export default function ClipCard({ clip, onClick, onDelete, isDeleting, isSelected }: ClipCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { channelStatus } = useYouTubeChannel();
  const { mutate: postToYouTube, isPending: isPosting, isSuccess, data: postResult, error } = usePostToYouTube();
  const { mutate: downloadClip, isPending: isDownloading } = useDownloadClip();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTime = Number(clip.startTime);
  const endTime = Number(clip.endTime);
  const duration = endTime - startTime;

  const handleDelete = () => {
    onDelete();
    setIsDialogOpen(false);
  };

  const handlePostToYouTube = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const videoIdMatch = clip.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (!videoIdMatch) {
      console.error('Invalid YouTube URL');
      return;
    }

    const videoId = videoIdMatch[1];
    
    postToYouTube({
      videoId,
      startTimestamp: clip.startTime,
      endTimestamp: clip.endTime,
      title: clip.title,
    });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const videoIdMatch = clip.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (!videoIdMatch) {
      console.error('Invalid YouTube URL');
      return;
    }

    const videoId = videoIdMatch[1];
    
    downloadClip({
      videoId,
      startTimestamp: clip.startTime,
      endTimestamp: clip.endTime,
      title: clip.title,
    });
  };

  const isConnected = channelStatus?.isConnected || false;
  const canPostToYouTube = isConnected && duration <= 60;

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2 flex-1">{clip.title}</CardTitle>
          <ViralScoreBadge score={clip.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
          <img
            src={clip.thumbnailUrl}
            alt={clip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(duration)}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {formatTime(startTime)} - {formatTime(endTime)}
        </div>

        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={handlePostToYouTube}
                    disabled={!canPostToYouTube || isPosting}
                  >
                    {isPosting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Posted
                      </>
                    ) : (
                      <>
                        <Youtube className="w-4 h-4 mr-2" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {!isConnected ? (
                  <p>Connect your Google account first to post to YouTube</p>
                ) : duration > 60 ? (
                  <p>Clip must be 60 seconds or less for YouTube Shorts</p>
                ) : (
                  <p>Post this clip to your YouTube channel</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </Button>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Clip</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{clip.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {!isConnected && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Connect your Google account to enable YouTube posting
            </AlertDescription>
          </Alert>
        )}

        {isSuccess && postResult && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription className="text-xs flex items-center justify-between">
              <span>Posted successfully!</span>
              {postResult.videoUrl && (
                <a
                  href={postResult.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {error.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

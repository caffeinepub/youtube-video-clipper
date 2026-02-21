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
import { Trash2, Clock, Loader2, Youtube, CheckCircle2, ExternalLink } from 'lucide-react';
import ViralScoreBadge from './ViralScoreBadge';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';
import { usePostToYouTube } from '../hooks/usePostToYouTube';
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
    
    // Extract video ID from URL
    const videoIdMatch = clip.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (!videoIdMatch) {
      console.error('Could not extract video ID from URL');
      return;
    }

    postToYouTube({
      videoId: videoIdMatch[1],
      startTimestamp: clip.startTime,
      endTimestamp: clip.endTime,
      title: clip.title,
    });
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div onClick={onClick}>
        <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
          <img
            src={clip.thumbnailUrl}
            alt={clip.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatTime(duration)}
          </div>
          <div className="absolute top-2 left-2">
            <ViralScoreBadge score={Math.round(clip.score)} showLabel={false} size="sm" />
          </div>
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-base line-clamp-2">{clip.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
            </div>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                  <AlertDialogTitle>Delete Clip?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{clip.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {channelStatus?.isConnected && (
            <div onClick={(e) => e.stopPropagation()} className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handlePostToYouTube}
                disabled={isPosting || isSuccess}
              >
                {isPosting ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-2 text-green-600" />
                    Posted!
                  </>
                ) : (
                  <>
                    <Youtube className="w-3 h-3 mr-2" />
                    Post to YouTube
                  </>
                )}
              </Button>

              {isSuccess && postResult && (
                <Alert className="py-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-xs">
                    <a 
                      href={postResult.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      View on YouTube
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-xs">
                    {error.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

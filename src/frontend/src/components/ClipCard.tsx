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
import { Trash2, Clock, Loader2 } from 'lucide-react';
import ViralScoreBadge from './ViralScoreBadge';
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
        <CardContent className="pt-0">
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
        </CardContent>
      </div>
    </Card>
  );
}

import React from 'react';
import { Scissors, Loader2 } from 'lucide-react';
import { useClips } from '../hooks/useClips';
import ClipCard from './ClipCard';
import { VideoClip } from '../backend';

interface ClipListProps {
  onClipSelect?: (clip: VideoClip) => void;
}

export default function ClipList({ onClipSelect }: ClipListProps) {
  const { data: clips, isLoading, error, deleteClip, isDeletingId } = useClips();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 text-sm">Failed to load clips</p>
      </div>
    );
  }

  if (!clips || clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
          <Scissors className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm font-medium">No clips yet</p>
        <p className="text-muted-foreground/60 text-xs mt-1">Load a YouTube video and create your first clip</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {clips.map((clip) => (
        <div
          key={clip.id}
          onClick={() => onClipSelect?.(clip)}
          className={onClipSelect ? 'cursor-pointer' : ''}
        >
          <ClipCard
            clip={clip}
            onDelete={(id) => deleteClip(id)}
            isDeleting={isDeletingId === clip.id}
          />
        </div>
      ))}
    </div>
  );
}

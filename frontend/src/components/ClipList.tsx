import React from 'react';
import { useClips } from '../hooks/useClips';
import ClipCard from './ClipCard';
import { Scissors } from 'lucide-react';

export default function ClipList() {
  const { data: clips, isLoading, deleteClip, isDeleting, deletingId } = useClips();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-2xl h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!clips || clips.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center border border-cyan-neon/10">
        <Scissors className="w-12 h-12 text-cyan-neon/30 mx-auto mb-4" />
        <h3 className="font-orbitron text-sm text-muted-foreground">NO CLIPS YET</h3>
        <p className="text-muted-foreground text-sm mt-2">Load a YouTube video and create your first clip!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {clips.map((clip) => (
        <ClipCard
          key={clip.id}
          clip={clip}
          onDelete={deleteClip}
          isDeleting={isDeleting && deletingId === clip.id}
        />
      ))}
    </div>
  );
}

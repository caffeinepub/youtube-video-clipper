import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Film, Loader2 } from 'lucide-react';
import { useClips } from '../hooks/useClips';
import ClipCard from './ClipCard';
import type { Clip } from '../backend';

interface ClipListProps {
  onClipSelect: (clip: Clip) => void;
  selectedClipId?: string;
}

export default function ClipList({ onClipSelect, selectedClipId }: ClipListProps) {
  const { clips, isLoading, deleteClip, isDeletingClip } = useClips();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="w-5 h-5" />
          Saved Clips
        </CardTitle>
        <CardDescription>
          {clips.length} {clips.length === 1 ? 'clip' : 'clips'} saved
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : clips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No clips saved yet</p>
            <p className="text-sm mt-1">Create your first clip above</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {clips.map((clip) => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  onClick={() => onClipSelect(clip)}
                  onDelete={() => deleteClip(clip.id)}
                  isDeleting={isDeletingClip === clip.id}
                  isSelected={selectedClipId === clip.id}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

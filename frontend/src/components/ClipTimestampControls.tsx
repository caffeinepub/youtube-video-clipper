import React, { useEffect, useState } from 'react';
import { Loader2, Save, Scissors } from 'lucide-react';
import { useClipTimestamps } from '../hooks/useClipTimestamps';
import { useClipCreation } from '../hooks/useClipCreation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClipTimestampControlsProps {
  videoUrl: string;
  videoId: string;
  suggestedStartTime?: number;
  suggestedEndTime?: number;
  suggestedTitle?: string;
  onClipSaved?: (title: string, startTime: number, endTime: number) => void;
}

export default function ClipTimestampControls({
  videoUrl,
  videoId,
  suggestedStartTime,
  suggestedEndTime,
  suggestedTitle,
  onClipSaved,
}: ClipTimestampControlsProps) {
  const [title, setTitle] = useState('');

  const {
    startMinutes,
    setStartMinutes,
    startSeconds,
    setStartSeconds,
    endMinutes,
    setEndMinutes,
    endSeconds,
    setEndSeconds,
    getTotalSeconds,
    isValid,
  } = useClipTimestamps();

  // useClipCreation now returns UseMutationResult directly
  const clipCreationMutation = useClipCreation();
  const isCreating = clipCreationMutation.isPending;

  const formatTimeDisplay = (minutes: string, seconds: string): string => {
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update form when a suggestion is selected
  useEffect(() => {
    if (suggestedStartTime !== undefined && suggestedEndTime !== undefined) {
      setStartMinutes(Math.floor(suggestedStartTime / 60).toString());
      setStartSeconds((suggestedStartTime % 60).toString());
      setEndMinutes(Math.floor(suggestedEndTime / 60).toString());
      setEndSeconds((suggestedEndTime % 60).toString());
      if (suggestedTitle) {
        setTitle(suggestedTitle);
      }
    }
  }, [suggestedStartTime, suggestedEndTime, suggestedTitle, setStartMinutes, setStartSeconds, setEndMinutes, setEndSeconds]);

  const handleSaveClip = async () => {
    if (!isValid) {
      toast.error('Invalid timestamp', {
        description: 'End time must be greater than start time',
      });
      return;
    }

    if (!title.trim()) {
      toast.error('Title required', {
        description: 'Please enter a title for your clip',
      });
      return;
    }

    const startTime = getTotalSeconds('start');
    const endTime = getTotalSeconds('end');
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    try {
      await clipCreationMutation.mutateAsync({
        title: title.trim(),
        videoUrl,
        thumbnailUrl,
        startTime,
        endTime,
      });

      if (onClipSaved) {
        onClipSaved(title.trim(), startTime, endTime);
      }

      // Reset form
      setTitle('');
      setStartMinutes('0');
      setStartSeconds('0');
      setEndMinutes('0');
      setEndSeconds('0');
    } catch (error) {
      // Error toast is handled in the mutation
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 border border-cyan-neon/20 space-y-4">
      <div className="flex items-center gap-2">
        <Scissors className="w-4 h-4 text-cyan-neon" />
        <h3 className="font-orbitron text-xs text-cyan-neon">CREATE CLIP</h3>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Clip Title</Label>
        <input
          placeholder="Enter clip title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Start Time</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min="0"
              placeholder="MM"
              value={startMinutes}
              onChange={(e) => setStartMinutes(e.target.value)}
              className="w-20 bg-purple-deep/50 border-cyan-neon/20 text-foreground focus:border-cyan-neon"
            />
            <span className="text-muted-foreground">:</span>
            <Input
              type="number"
              min="0"
              max="59"
              placeholder="SS"
              value={startSeconds}
              onChange={(e) => setStartSeconds(e.target.value)}
              className="w-20 bg-purple-deep/50 border-cyan-neon/20 text-foreground focus:border-cyan-neon"
            />
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {formatTimeDisplay(startMinutes, startSeconds)}
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">End Time</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min="0"
              placeholder="MM"
              value={endMinutes}
              onChange={(e) => setEndMinutes(e.target.value)}
              className="w-20 bg-purple-deep/50 border-cyan-neon/20 text-foreground focus:border-cyan-neon"
            />
            <span className="text-muted-foreground">:</span>
            <Input
              type="number"
              min="0"
              max="59"
              placeholder="SS"
              value={endSeconds}
              onChange={(e) => setEndSeconds(e.target.value)}
              className="w-20 bg-purple-deep/50 border-cyan-neon/20 text-foreground focus:border-cyan-neon"
            />
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {formatTimeDisplay(endMinutes, endSeconds)}
          </p>
        </div>
      </div>

      <button
        onClick={handleSaveClip}
        disabled={isCreating || !isValid || !title.trim()}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg cyberpunk-btn transition-smooth text-sm font-semibold disabled:opacity-50"
      >
        {isCreating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Clip
          </>
        )}
      </button>
    </div>
  );
}

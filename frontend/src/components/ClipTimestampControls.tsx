import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Scissors } from 'lucide-react';
import { useClipTimestamps } from '../hooks/useClipTimestamps';
import { useClipCreation } from '../hooks/useClipCreation';
import { toast } from 'sonner';

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

  const { createClip, isCreating } = useClipCreation();

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
      await createClip(title.trim(), videoUrl, thumbnailUrl, startTime, endTime);

      toast.success('Clip saved!', {
        description: `"${title}" has been saved successfully`,
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
      toast.error('Failed to save clip', {
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <Card className="bg-transparent border-0 shadow-none p-0">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2 text-white">
          <Scissors className="w-5 h-5 text-indigo-400" />
          Create Clip
        </CardTitle>
        <CardDescription>
          Set the start and end timestamps for your clip
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-muted-foreground text-xs">Clip Title</Label>
          <Input
            id="title"
            placeholder="Enter clip title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-indigo-500/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Start Time</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="0"
                placeholder="MM"
                value={startMinutes}
                onChange={(e) => setStartMinutes(e.target.value)}
                className="w-20 bg-white/5 border-white/10 text-white focus:border-indigo-500/60"
              />
              <span className="text-muted-foreground">:</span>
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="SS"
                value={startSeconds}
                onChange={(e) => setStartSeconds(e.target.value)}
                className="w-20 bg-white/5 border-white/10 text-white focus:border-indigo-500/60"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatTimeDisplay(startMinutes, startSeconds)}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">End Time</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="0"
                placeholder="MM"
                value={endMinutes}
                onChange={(e) => setEndMinutes(e.target.value)}
                className="w-20 bg-white/5 border-white/10 text-white focus:border-indigo-500/60"
              />
              <span className="text-muted-foreground">:</span>
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="SS"
                value={endSeconds}
                onChange={(e) => setEndSeconds(e.target.value)}
                className="w-20 bg-white/5 border-white/10 text-white focus:border-indigo-500/60"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatTimeDisplay(endMinutes, endSeconds)}
            </p>
          </div>
        </div>

        <Button
          onClick={handleSaveClip}
          disabled={isCreating || !isValid || !title.trim()}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Clip
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Scissors } from 'lucide-react';
import { useClipTimestamps } from '../hooks/useClipTimestamps';
import { useClipCreation } from '../hooks/useClipCreation';
import { toast } from 'sonner';
import type { VideoClip } from '../backend';

interface ClipTimestampControlsProps {
  videoUrl: string;
  videoId: string;
  selectedClip?: VideoClip | null;
  suggestedStartTime?: number;
  suggestedEndTime?: number;
  suggestedTitle?: string;
}

export default function ClipTimestampControls({ 
  videoUrl, 
  videoId, 
  selectedClip,
  suggestedStartTime,
  suggestedEndTime,
  suggestedTitle
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
    formatTimeRange,
  } = useClipTimestamps();

  const { createClip, isCreating } = useClipCreation();

  const formatTimeDisplay = (minutes: string, seconds: string): string => {
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update form when a clip is selected
  useEffect(() => {
    if (selectedClip) {
      setTitle(selectedClip.title);
      const startTime = Number(selectedClip.startTime);
      const endTime = Number(selectedClip.endTime);
      setStartMinutes(Math.floor(startTime / 60).toString());
      setStartSeconds((startTime % 60).toString());
      setEndMinutes(Math.floor(endTime / 60).toString());
      setEndSeconds((endTime % 60).toString());
    }
  }, [selectedClip, setStartMinutes, setStartSeconds, setEndMinutes, setEndSeconds]);

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
      await createClip(
        title.trim(),
        videoUrl,
        thumbnailUrl,
        startTime,
        endTime
      );

      toast.success('Clip saved!', {
        description: `"${title}" has been saved successfully`,
      });

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="w-5 h-5" />
          Create Clip
        </CardTitle>
        <CardDescription>
          Set the start and end timestamps for your clip
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Clip Title</Label>
          <Input
            id="title"
            placeholder="Enter clip title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Time</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="0"
                placeholder="MM"
                value={startMinutes}
                onChange={(e) => setStartMinutes(e.target.value)}
                className="w-20"
              />
              <span className="text-muted-foreground">:</span>
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="SS"
                value={startSeconds}
                onChange={(e) => setStartSeconds(e.target.value)}
                className="w-20"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatTimeDisplay(startMinutes, startSeconds)}
            </p>
          </div>

          <div className="space-y-2">
            <Label>End Time</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="0"
                placeholder="MM"
                value={endMinutes}
                onChange={(e) => setEndMinutes(e.target.value)}
                className="w-20"
              />
              <span className="text-muted-foreground">:</span>
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="SS"
                value={endSeconds}
                onChange={(e) => setEndSeconds(e.target.value)}
                className="w-20"
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
          className="w-full"
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

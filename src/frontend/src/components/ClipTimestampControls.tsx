import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scissors, Save, AlertCircle, Loader2 } from 'lucide-react';
import { useClipTimestamps } from '../hooks/useClipTimestamps';
import { useClipCreation } from '../hooks/useClipCreation';
import type { Clip } from '../backend';
import { toast } from 'sonner';

interface ClipTimestampControlsProps {
  videoUrl: string;
  videoId: string;
  selectedClip?: Clip | null;
}

export default function ClipTimestampControls({ videoUrl, videoId, selectedClip }: ClipTimestampControlsProps) {
  const [title, setTitle] = useState('');
  const {
    startMinutes,
    startSeconds,
    endMinutes,
    endSeconds,
    setStartMinutes,
    setStartSeconds,
    setEndMinutes,
    setEndSeconds,
    getTotalSeconds,
    isValid,
    validationError,
    formatTimeRange,
    setFromSeconds
  } = useClipTimestamps();

  const { createClip, isCreating } = useClipCreation();

  // Load selected clip data
  useEffect(() => {
    if (selectedClip) {
      setTitle(selectedClip.title);
      setFromSeconds(Number(selectedClip.startTime), Number(selectedClip.endTime));
    }
  }, [selectedClip, setFromSeconds]);

  const handleSaveClip = async () => {
    if (!title.trim()) {
      toast.error('Please enter a clip title');
      return;
    }

    if (!isValid) {
      toast.error(validationError || 'Invalid timestamp range');
      return;
    }

    const startTime = getTotalSeconds('start');
    const endTime = getTotalSeconds('end');
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    try {
      await createClip(title, videoUrl, thumbnailUrl, startTime, endTime);
      toast.success('Clip saved successfully!');
      setTitle('');
      setStartMinutes('0');
      setStartSeconds('0');
      setEndMinutes('0');
      setEndSeconds('0');
    } catch (error) {
      toast.error('Failed to save clip');
      console.error(error);
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
          Set start and end times for your video clip
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="clip-title">Clip Title</Label>
          <Input
            id="clip-title"
            type="text"
            placeholder="My awesome clip"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Time */}
          <div className="space-y-2">
            <Label>Start Time</Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={startMinutes}
                  onChange={(e) => setStartMinutes(e.target.value)}
                />
              </div>
              <span className="text-muted-foreground">:</span>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Sec"
                  value={startSeconds}
                  onChange={(e) => setStartSeconds(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <Label>End Time</Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={endMinutes}
                  onChange={(e) => setEndMinutes(e.target.value)}
                />
              </div>
              <span className="text-muted-foreground">:</span>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Sec"
                  value={endSeconds}
                  onChange={(e) => setEndSeconds(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {isValid && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            Clip duration: {formatTimeRange()}
          </div>
        )}

        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleSaveClip} 
          disabled={!isValid || isCreating || !title.trim()}
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

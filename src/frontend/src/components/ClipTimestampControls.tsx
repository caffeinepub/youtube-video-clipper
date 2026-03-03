import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Loader2, Save, Scissors, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useClipCreation } from "../hooks/useClipCreation";
import { useClipTimestamps } from "../hooks/useClipTimestamps";
import { addToQueue, markQueueItemDone, markQueueItemError } from "./ClipQueue";

interface ClipTimestampControlsProps {
  videoUrl: string;
  videoId: string;
  suggestedStartTime?: number;
  suggestedEndTime?: number;
  suggestedTitle?: string;
  onClipSaved?: (title: string, startTime: number, endTime: number) => void;
}

function formatDurationLabel(seconds: number): string {
  if (seconds < 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

const QUICK_PRESETS = [
  { label: "Last 15s", seconds: 15 },
  { label: "Last 30s", seconds: 30 },
  { label: "Last 60s", seconds: 60 },
];

export default function ClipTimestampControls({
  videoUrl,
  videoId,
  suggestedStartTime,
  suggestedEndTime,
  suggestedTitle,
  onClipSaved,
}: ClipTimestampControlsProps) {
  const [title, setTitle] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [activePreset, setActivePreset] = useState<number | null>(null);

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

  const startSec = getTotalSeconds("start");
  const endSec = getTotalSeconds("end");
  const duration = endSec - startSec;

  const formatTimeDisplay = (minutes: string, seconds: string): string => {
    const mins = Number.parseInt(minutes) || 0;
    const secs = Number.parseInt(seconds) || 0;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
      setActivePreset(null);
    }
  }, [
    suggestedStartTime,
    suggestedEndTime,
    suggestedTitle,
    setStartMinutes,
    setStartSeconds,
    setEndMinutes,
    setEndSeconds,
  ]);

  const applyPreset = (offsetSeconds: number) => {
    // Set end to current start + preset duration, or if start is 0, just set 0→preset
    const currentEnd = getTotalSeconds("end");
    const currentStart = getTotalSeconds("start");
    let newStart: number;
    let newEnd: number;

    if (currentEnd > 0) {
      // Clip last N seconds of current end point
      newEnd = currentEnd;
      newStart = Math.max(0, currentEnd - offsetSeconds);
    } else if (currentStart > 0) {
      newEnd = currentStart + offsetSeconds;
      newStart = currentStart;
    } else {
      newStart = 0;
      newEnd = offsetSeconds;
    }

    setStartMinutes(Math.floor(newStart / 60).toString());
    setStartSeconds((newStart % 60).toString());
    setEndMinutes(Math.floor(newEnd / 60).toString());
    setEndSeconds((newEnd % 60).toString());
    setActivePreset(offsetSeconds);
  };

  const applyCustomDuration = () => {
    const secs = Number.parseInt(customDuration);
    if (Number.isNaN(secs) || secs <= 0) {
      toast.error("Enter a valid duration in seconds");
      return;
    }
    applyPreset(secs);
  };

  const handleSaveClip = async () => {
    if (!isValid) {
      toast.error("Invalid timestamp", {
        description: "End time must be greater than start time",
      });
      return;
    }

    if (!title.trim()) {
      toast.error("Title required", {
        description: "Please enter a title for your clip",
      });
      return;
    }

    const startTime = getTotalSeconds("start");
    const endTime = getTotalSeconds("end");
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    // Add to queue
    const queueId = `clip_${Date.now()}`;
    addToQueue(queueId, title.trim());
    toast("🎬 Processing clip...");

    try {
      await createClip(
        title.trim(),
        videoUrl,
        thumbnailUrl,
        startTime,
        endTime,
      );
      markQueueItemDone(queueId);

      toast.success(`Clip saved! 🎬 "${title.trim()}"`, {
        description: `Duration: ${formatDurationLabel(endTime - startTime)}`,
      });

      if (onClipSaved) {
        onClipSaved(title.trim(), startTime, endTime);
      }

      // Reset form
      setTitle("");
      setStartMinutes("0");
      setStartSeconds("0");
      setEndMinutes("0");
      setEndSeconds("0");
      setActivePreset(null);
    } catch (error) {
      markQueueItemError(
        queueId,
        error instanceof Error ? error.message : "Unknown error",
      );
      toast.error("Failed to save clip", {
        description:
          error instanceof Error ? error.message : "An error occurred",
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
        {/* Quick Presets */}
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Quick Presets
          </Label>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.seconds}
                onClick={() => applyPreset(preset.seconds)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium ${
                  activePreset === preset.seconds
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white"
                }`}
                data-ocid="clip.button"
              >
                {preset.label}
              </button>
            ))}
            {/* Custom duration */}
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="1"
                placeholder="Custom s"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                className="w-20 h-7 text-xs bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-indigo-500/60"
              />
              <button
                type="button"
                onClick={applyCustomDuration}
                className="text-xs px-2 py-1.5 rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-muted-foreground text-xs">
            Clip Title
          </Label>
          <Input
            id="title"
            placeholder="Enter clip title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-indigo-500/60"
            data-ocid="clip.input"
          />
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Start Time</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="0"
                placeholder="MM"
                value={startMinutes}
                onChange={(e) => {
                  setStartMinutes(e.target.value);
                  setActivePreset(null);
                }}
                className="w-20 bg-white/5 border-white/10 text-white focus:border-indigo-500/60"
              />
              <span className="text-muted-foreground">:</span>
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="SS"
                value={startSeconds}
                onChange={(e) => {
                  setStartSeconds(e.target.value);
                  setActivePreset(null);
                }}
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
                onChange={(e) => {
                  setEndMinutes(e.target.value);
                  setActivePreset(null);
                }}
                className="w-20 bg-white/5 border-white/10 text-white focus:border-indigo-500/60"
              />
              <span className="text-muted-foreground">:</span>
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="SS"
                value={endSeconds}
                onChange={(e) => {
                  setEndSeconds(e.target.value);
                  setActivePreset(null);
                }}
                className="w-20 bg-white/5 border-white/10 text-white focus:border-indigo-500/60"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatTimeDisplay(endMinutes, endSeconds)}
            </p>
          </div>
        </div>

        {/* Duration display */}
        {isValid && duration > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Clock className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="text-indigo-300 text-xs font-medium">
              Duration: {formatDurationLabel(duration)}
            </span>
            {duration >= 15 && duration <= 60 && (
              <Badge className="ml-auto text-xs bg-green-500/20 text-green-300 border-green-500/30 border px-1.5 py-0">
                Ideal
              </Badge>
            )}
          </div>
        )}

        <Button
          onClick={handleSaveClip}
          disabled={isCreating || !isValid || !title.trim()}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
          data-ocid="clip.submit_button"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving…
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

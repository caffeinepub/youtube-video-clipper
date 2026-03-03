import React, { useState } from 'react';
import { Calendar, Clock, Trash2, Plus, Youtube, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useActor } from '../hooks/useActor';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';
import { VideoClip, ScheduledUpload } from '../backend';

function useScheduledUploads() {
  const { actor, isFetching } = useActor();
  return useQuery<ScheduledUpload[]>({
    queryKey: ['scheduledUploads'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyScheduledUploads();
    },
    enabled: !!actor && !isFetching,
  });
}

function useAddScheduledUpload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ clipId, scheduledAt }: { clipId: string; scheduledAt: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addScheduledUpload(clipId, scheduledAt);
    },
    onSuccess: () => {
      toast.success('Upload scheduled successfully');
      queryClient.invalidateQueries({ queryKey: ['scheduledUploads'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useDeleteScheduledUpload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entryId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteScheduledUpload(entryId);
    },
    onSuccess: () => {
      toast.success('Scheduled upload removed');
      queryClient.invalidateQueries({ queryKey: ['scheduledUploads'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useClips() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoClip[]>({
    queryKey: ['clips'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClips('');
    },
    enabled: !!actor && !isFetching,
  });
}

export default function Scheduler() {
  const { channelStatus } = useYouTubeChannel();
  const { data: uploads, isLoading: uploadsLoading } = useScheduledUploads();
  const { data: clips, isLoading: clipsLoading } = useClips();
  const addMutation = useAddScheduledUpload();
  const deleteMutation = useDeleteScheduledUpload();

  const [selectedClipId, setSelectedClipId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  const isConnected = channelStatus?.isConnected;

  const handleSchedule = async () => {
    if (!selectedClipId || !scheduledDate) {
      toast.error('Please select a clip and schedule date');
      return;
    }
    const ts = BigInt(new Date(scheduledDate).getTime()) * BigInt(1_000_000);
    await addMutation.mutateAsync({ clipId: selectedClipId, scheduledAt: ts });
    setSelectedClipId('');
    setScheduledDate('');
  };

  const formatScheduledDate = (ts: bigint) => {
    return new Date(Number(ts) / 1_000_000).toLocaleString();
  };

  const getClipTitle = (clipId: string) => {
    return clips?.find(c => c.id === clipId)?.title || clipId;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-white font-bold text-2xl font-display">Upload Scheduler</h1>
          <p className="text-muted-foreground text-sm">Schedule your clips for YouTube upload</p>
        </div>
      </div>

      {/* YouTube Channel Status */}
      <div className="glass-card p-4 flex items-center gap-3">
        <Youtube className="w-5 h-5 text-red-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-white text-sm font-medium">YouTube Channel</p>
          <p className="text-muted-foreground text-xs">
            {isConnected ? channelStatus?.channelName || 'Connected' : 'Not connected'}
          </p>
        </div>
        {isConnected ? (
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-4 h-4" />
            Connected
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
            <XCircle className="w-4 h-4" />
            Disconnected
          </div>
        )}
      </div>

      {/* Schedule Form */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" />
          Schedule New Upload
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">Select Clip</label>
            {clipsLoading ? (
              <Skeleton className="h-9 bg-white/5" />
            ) : (
              <Select value={selectedClipId} onValueChange={setSelectedClipId}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-9">
                  <SelectValue placeholder="Choose a clip..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0B0E14] border-white/10">
                  {clips?.map(clip => (
                    <SelectItem key={clip.id} value={clip.id} className="text-white text-xs">
                      {clip.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">Schedule Date & Time</label>
            <Input
              type="datetime-local"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="bg-white/5 border-white/10 text-white h-9 [color-scheme:dark]"
            />
          </div>
        </div>

        <Button
          onClick={handleSchedule}
          disabled={addMutation.isPending || !selectedClipId || !scheduledDate}
          className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2 w-full sm:w-auto"
        >
          {addMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Calendar className="w-4 h-4" />
          )}
          Schedule Upload
        </Button>
      </div>

      {/* Scheduled Uploads List */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          Scheduled Uploads
          {uploads && uploads.length > 0 && (
            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">
              {uploads.length}
            </span>
          )}
        </h2>

        {uploadsLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 bg-white/5 rounded-xl" />
            ))}
          </div>
        ) : !uploads || uploads.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground text-sm">No scheduled uploads yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {uploads.map((upload) => (
              <div key={upload.id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                  <Youtube className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{getClipTitle(upload.clipId)}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatScheduledDate(upload.scheduledAt)}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#0B0E14] border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Remove Scheduled Upload?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This will cancel the scheduled upload for "{getClipTitle(upload.clipId)}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(upload.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

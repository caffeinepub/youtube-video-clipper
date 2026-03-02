import React, { useState } from 'react';
import { Calendar, Clock, Trash2, Plus, Youtube, CheckCircle, XCircle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useClips } from '../hooks/useClips';
import {
  useScheduledUploads,
  useAddScheduledUpload,
  useDeleteScheduledUpload,
} from '../hooks/useScheduledUploads';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';
import { LogIn } from 'lucide-react';
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

export default function Scheduler() {
  const { identity } = useInternetIdentity();
  const { isConnected, channelName } = useYouTubeChannel();
  const { data: clips = [] } = useClips();
  const { data: uploads = [], isLoading: uploadsLoading } = useScheduledUploads();
  const { mutate: addSchedule, isPending: isAdding } = useAddScheduledUpload();
  const { mutate: deleteSchedule, isPending: isDeleting } = useDeleteScheduledUpload();

  const [selectedClipId, setSelectedClipId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="glass-card rounded-2xl p-8 text-center max-w-sm">
          <LogIn className="w-12 h-12 text-cyan-neon mx-auto mb-4" />
          <h2 className="font-orbitron text-lg text-cyan-neon mb-2">LOGIN REQUIRED</h2>
          <p className="text-muted-foreground text-sm">Please login to use the scheduler.</p>
        </div>
      </div>
    );
  }

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClipId || !scheduledAt) return;

    const scheduledAtMs = BigInt(new Date(scheduledAt).getTime() * 1_000_000);
    addSchedule(
      { clipId: selectedClipId, scheduledAt: scheduledAtMs },
      {
        onSuccess: () => {
          setSelectedClipId('');
          setScheduledAt('');
        },
      }
    );
  };

  const formatScheduledDate = (ts: bigint) => {
    return new Date(Number(ts) / 1_000_000).toLocaleString();
  };

  const getClipTitle = (clipId: string) => {
    return clips.find((c) => c.id === clipId)?.title || clipId;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-cyan-neon" />
          <div>
            <h1 className="font-orbitron text-xl text-cyan-neon">SCHEDULER</h1>
            <p className="text-muted-foreground text-sm">Schedule clips for YouTube upload</p>
          </div>
        </div>
      </div>

      {/* YouTube Channel Status */}
      <div className="glass-card rounded-2xl p-4 border border-cyan-neon/20 flex items-center gap-3">
        <Youtube className="w-5 h-5 text-red-400 shrink-0" />
        <div className="flex-1">
          <p className="text-foreground text-sm font-semibold">YouTube Channel</p>
          <p className="text-muted-foreground text-xs">
            {isConnected ? channelName || 'Connected' : 'Not connected'}
          </p>
        </div>
        {isConnected ? (
          <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
            <CheckCircle className="w-4 h-4" />
            Connected
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
            <XCircle className="w-4 h-4" />
            Disconnected
          </div>
        )}
      </div>

      {/* Schedule Form */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-neon/20">
        <h2 className="font-orbitron text-xs text-cyan-neon mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          SCHEDULE NEW UPLOAD
        </h2>

        <form onSubmit={handleSchedule} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Select Clip</label>
              <select
                value={selectedClipId}
                onChange={(e) => setSelectedClipId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm focus:outline-none focus:border-cyan-neon transition-smooth"
                required
              >
                <option value="">Choose a clip...</option>
                {clips.map((clip) => (
                  <option key={clip.id} value={clip.id}>
                    {clip.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Schedule Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm focus:outline-none focus:border-cyan-neon transition-smooth [color-scheme:dark]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAdding || !selectedClipId || !scheduledAt}
            className="flex items-center gap-2 px-4 py-2 rounded-lg cyberpunk-btn transition-smooth text-sm font-semibold disabled:opacity-50"
          >
            <Calendar className="w-4 h-4" />
            {isAdding ? 'Scheduling...' : 'Schedule Upload'}
          </button>
        </form>
      </div>

      {/* Scheduled Uploads List */}
      <div className="space-y-3">
        <h2 className="font-orbitron text-xs text-cyan-neon flex items-center gap-2">
          <Clock className="w-4 h-4" />
          SCHEDULED UPLOADS
          {uploads.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon">
              {uploads.length}
            </span>
          )}
        </h2>

        {uploadsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl h-16 animate-pulse" />
            ))}
          </div>
        ) : uploads.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-cyan-neon/10">
            <Clock className="w-12 h-12 text-cyan-neon/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">No scheduled uploads yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="glass-card rounded-2xl p-4 border border-cyan-neon/10 flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-red-900/20 border border-red-500/20 flex items-center justify-center shrink-0">
                  <Youtube className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-semibold truncate">
                    {getClipTitle(upload.clipId)}
                  </p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatScheduledDate(upload.scheduledAt)}
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-900/20 transition-smooth shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-card border border-cyan-neon/30">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-orbitron text-cyan-neon">
                        Remove Schedule?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove the scheduled upload for "{getClipTitle(upload.clipId)}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteSchedule(upload.id)}
                        className="bg-red-600 hover:bg-red-700"
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

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        <p>
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-neon hover:underline"
          >
            caffeine.ai
          </a>{' '}
          · © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

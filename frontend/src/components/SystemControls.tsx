import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { SystemStatus } from '../backend';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, Power, RotateCcw, PauseCircle, PlayCircle, AlertTriangle } from 'lucide-react';

export function SystemControls() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: systemStatus, isLoading: statusLoading } = useSystemStatus();
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [restartDialogOpen, setRestartDialogOpen] = useState(false);
  const [shutdownDialogOpen, setShutdownDialogOpen] = useState(false);

  const isPaused = systemStatus === SystemStatus.paused;

  const pauseMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Not connected');
      return actor.togglePauseSystem();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
      } else {
        toast.error('Action failed', { description: result.message });
      }
    },
    onError: (err: Error) => {
      toast.error('Failed to toggle pause state', { description: err.message });
    },
  });

  const restartMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Not connected');
      return actor.serverRestartAction();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
      } else {
        toast.error('Restart failed', { description: result.message });
      }
    },
    onError: (err: Error) => {
      toast.error('Restart failed', { description: err.message });
    },
  });

  const shutdownMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Not connected');
      return actor.serverShutdownAction();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
      } else {
        toast.error('Shutdown failed', { description: result.message });
      }
    },
    onError: (err: Error) => {
      toast.error('Shutdown failed', { description: err.message });
    },
  });

  const statusLabel = statusLoading
    ? 'Loading…'
    : systemStatus === SystemStatus.running
    ? 'Running'
    : systemStatus === SystemStatus.paused
    ? 'Paused'
    : systemStatus === SystemStatus.restarting
    ? 'Restarting'
    : systemStatus === SystemStatus.shutting_down
    ? 'Shutting Down'
    : 'Unknown';

  const statusDotColor = isPaused
    ? 'bg-yellow-500'
    : systemStatus === SystemStatus.running
    ? 'bg-green-500'
    : 'bg-red-500';

  const statusTextColor = isPaused
    ? 'text-yellow-400'
    : systemStatus === SystemStatus.running
    ? 'text-green-400'
    : 'text-red-400';

  return (
    <div className="space-y-5">
      {/* Status indicator */}
      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/8">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDotColor}`} />
        <span className="text-sm text-muted-foreground">System Status:</span>
        <span className={`text-sm font-semibold ${statusTextColor}`}>{statusLabel}</span>
      </div>

      {/* Pause / Resume toggle */}
      <div className="flex items-center justify-between p-4 bg-white/3 border border-white/8 rounded-xl">
        <div className="flex flex-col gap-1 flex-1 mr-4">
          <div className="flex items-center gap-2">
            {isPaused ? (
              <PauseCircle className="w-5 h-5 text-yellow-400" />
            ) : (
              <PlayCircle className="w-5 h-5 text-green-400" />
            )}
            <Label className="text-sm font-semibold text-white cursor-pointer">
              {isPaused ? 'App is Paused' : 'App is Running'}
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            {isPaused
              ? 'Regular users see a maintenance screen. Admins can still access the panel.'
              : 'Toggle to pause the app for all non-admin users.'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {pauseMutation.isPending && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
          <Switch
            checked={!isPaused}
            onCheckedChange={() => setPauseDialogOpen(true)}
            disabled={pauseMutation.isPending || statusLoading}
          />
        </div>
      </div>

      {/* Danger zone */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Danger Zone</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => setRestartDialogOpen(true)}
            disabled={restartMutation.isPending || shutdownMutation.isPending}
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/50 gap-2"
          >
            {restartMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Restart
          </Button>
          <Button
            variant="outline"
            onClick={() => setShutdownDialogOpen(true)}
            disabled={restartMutation.isPending || shutdownMutation.isPending}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 gap-2"
          >
            {shutdownMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            Shutdown
          </Button>
        </div>
        <p className="text-xs text-orange-300/70">
          These actions affect all users. Ensure a maintenance window is scheduled.
        </p>
      </div>

      {/* Pause/Resume confirmation dialog */}
      <AlertDialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <AlertDialogContent className="bg-[#0B0E14] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {isPaused ? 'Resume Application?' : 'Pause Application?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {isPaused
                ? 'This will resume the application and allow all users to access it normally.'
                : 'This will pause the application. Regular users will see a maintenance screen. Admins and owners can still access the admin panel.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setPauseDialogOpen(false);
                pauseMutation.mutate();
              }}
              className={isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}
            >
              {isPaused ? 'Resume App' : 'Pause App'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restart confirmation dialog */}
      <AlertDialog open={restartDialogOpen} onOpenChange={setRestartDialogOpen}>
        <AlertDialogContent className="bg-[#0B0E14] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Restart Server?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will reset message counters and temporarily interrupt service. Clip and user data will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { setRestartDialogOpen(false); restartMutation.mutate(); }}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Confirm Restart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Shutdown confirmation dialog */}
      <AlertDialog open={shutdownDialogOpen} onOpenChange={setShutdownDialogOpen}>
        <AlertDialogContent className="bg-[#0B0E14] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Shutdown Server?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will initiate a server shutdown sequence. The system will become unavailable until manually restarted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { setShutdownDialogOpen(false); shutdownMutation.mutate(); }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Confirm Shutdown
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

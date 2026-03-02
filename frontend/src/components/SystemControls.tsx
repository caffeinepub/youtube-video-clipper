import React, { useState } from 'react';
import { useSystemStatus, setGlobalSystemStatus } from '../hooks/useSystemStatus';
import { useActor } from '../hooks/useActor';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { Power, RefreshCw, AlertTriangle, Activity } from 'lucide-react';
import { toast } from 'sonner';

export function SystemControls() {
  const { data: systemStatus } = useSystemStatus();
  const { actor } = useActor();
  const [isUpdating, setIsUpdating] = useState(false);

  const isPaused = systemStatus === 'paused';

  const handleTogglePause = async () => {
    setIsUpdating(true);
    try {
      if (isPaused) {
        if (actor) await (actor as any).resumeSystem?.();
        setGlobalSystemStatus('running');
        toast.success('System resumed');
      } else {
        if (actor) await (actor as any).pauseSystem?.();
        setGlobalSystemStatus('paused');
        toast.success('System paused');
      }
    } catch (err: any) {
      toast.error(`Failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRestart = async () => {
    setIsUpdating(true);
    try {
      if (actor) await (actor as any).restartSystem?.();
      setGlobalSystemStatus('restarting');
      toast.success('System restarting...');
      setTimeout(() => setGlobalSystemStatus('running'), 3000);
    } catch (err: any) {
      toast.error(`Failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShutdown = async () => {
    setIsUpdating(true);
    try {
      if (actor) await (actor as any).shutdownSystem?.();
      setGlobalSystemStatus('shutting_down');
      toast.success('System shutting down...');
    } catch (err: any) {
      toast.error(`Failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border/50 p-4 space-y-4">
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <Activity
          size={16}
          className={isPaused ? 'text-yellow-400' : 'text-green-400'}
        />
        <span className="text-sm text-foreground">
          Status:{' '}
          <span
            className={`font-semibold ${
              isPaused ? 'text-yellow-400' : 'text-green-400'
            }`}
          >
            {systemStatus || 'running'}
          </span>
        </span>
      </div>

      {/* Pause/Resume toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-foreground">
          {isPaused ? 'System Paused' : 'System Running'}
        </Label>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Switch checked={!isPaused} disabled={isUpdating} />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isPaused ? 'Resume System?' : 'Pause System?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isPaused
                  ? 'This will resume normal operations for all users.'
                  : 'This will pause the system. Non-admin users will see a maintenance screen.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleTogglePause} disabled={isUpdating}>
                {isPaused ? 'Resume' : 'Pause'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Restart button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-border text-foreground hover:bg-muted"
            disabled={isUpdating}
          >
            <RefreshCw size={14} className="mr-2" />
            Restart System
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Restart System?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restart the system. There may be brief downtime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestart} disabled={isUpdating}>
              Restart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Shutdown button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            disabled={isUpdating}
          >
            <Power size={14} className="mr-2" />
            Shutdown System
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-destructive" />
              Shutdown System?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will shut down the system completely. This action may be
              irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleShutdown}
              disabled={isUpdating}
              className="bg-destructive hover:bg-destructive/90"
            >
              Shutdown
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SystemControls;

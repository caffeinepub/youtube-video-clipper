import React, { useState } from 'react';
import { Power, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useActor } from '../hooks/useActor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

function useServerRestart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.serverRestartAction();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
    onError: (err: Error) => {
      toast.error(`Restart failed: ${err.message}`);
    },
  });
}

function useServerShutdown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.serverShutdownAction();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
    onError: (err: Error) => {
      toast.error(`Shutdown failed: ${err.message}`);
    },
  });
}

export default function SystemControls() {
  const restartMutation = useServerRestart();
  const shutdownMutation = useServerShutdown();

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">System Controls</h3>
          <p className="text-muted-foreground text-xs">Dangerous operations — use with caution</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Restart */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/50 gap-2"
              disabled={restartMutation.isPending || shutdownMutation.isPending}
            >
              {restartMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Restart
            </Button>
          </AlertDialogTrigger>
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
                onClick={() => restartMutation.mutate()}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Confirm Restart
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Shutdown */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 gap-2"
              disabled={restartMutation.isPending || shutdownMutation.isPending}
            >
              {shutdownMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Power className="w-4 h-4" />
              )}
              Shutdown
            </Button>
          </AlertDialogTrigger>
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
                onClick={() => shutdownMutation.mutate()}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Confirm Shutdown
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
        <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
        <p className="text-orange-300/80 text-xs">These actions affect all users. Ensure maintenance window is scheduled.</p>
      </div>
    </div>
  );
}

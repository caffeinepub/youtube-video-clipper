import React, { useState } from 'react';
import { Power, RotateCcw, Pause, Play } from 'lucide-react';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { setGlobalSystemStatus } from '../hooks/useSystemStatus';
import type { SystemStatus } from '../types/app';
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

export function SystemControls() {
  const { data: status } = useSystemStatus();
  const isPaused = status === 'paused';

  const handleTogglePause = () => {
    setGlobalSystemStatus(isPaused ? 'running' : 'paused');
  };

  const handleRestart = () => {
    setGlobalSystemStatus('restarting');
    setTimeout(() => setGlobalSystemStatus('running'), 2000);
  };

  const handleShutdown = () => {
    setGlobalSystemStatus('shutting_down');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-neon/5 border border-cyan-neon/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'running' ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
          <span className="text-sm text-foreground capitalize">{status?.replace('_', ' ') || 'running'}</span>
        </div>
        <button
          onClick={handleTogglePause}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-smooth ${
            isPaused
              ? 'bg-green-900/30 border-green-500/40 text-green-400 hover:bg-green-900/50'
              : 'bg-yellow-900/30 border-yellow-500/40 text-yellow-400 hover:bg-yellow-900/50'
          }`}
        >
          {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-blue-900/30 border border-blue-500/40 text-blue-400 hover:bg-blue-900/50 transition-smooth">
              <RotateCcw className="w-3 h-3" />
              Restart
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-card border-cyan-neon/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-orbitron text-cyan-neon">Restart System?</AlertDialogTitle>
              <AlertDialogDescription>This will temporarily restart the system.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRestart}>Restart</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-red-900/30 border border-red-500/40 text-red-400 hover:bg-red-900/50 transition-smooth">
              <Power className="w-3 h-3" />
              Shutdown
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-card border-cyan-neon/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-orbitron text-red-400">Shutdown System?</AlertDialogTitle>
              <AlertDialogDescription>This will shut down the system.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleShutdown} className="bg-red-600 hover:bg-red-700">
                Shutdown
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

import React from 'react';
import { Youtube, CheckCircle, Loader2 } from 'lucide-react';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';

export default function ChannelConnection() {
  const { isConnected, channelName, isLoading } = useYouTubeChannel();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-neon/5 border border-cyan-neon/20 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin text-cyan-neon" />
        <span>Checking...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-900/20 border border-green-500/30 text-green-400 text-sm">
        <CheckCircle className="w-4 h-4" />
        <span className="font-medium">{channelName || 'YouTube Connected'}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
      <Youtube className="w-4 h-4" />
      <span>YouTube not connected</span>
    </div>
  );
}

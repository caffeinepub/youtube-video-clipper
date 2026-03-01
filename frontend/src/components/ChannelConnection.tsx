import React from 'react';
import { Youtube, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function ChannelConnection() {
  const { identity } = useInternetIdentity();
  const { channelStatus, isLoading, isConfigured, connectChannel } = useYouTubeChannel();

  const isConnected = channelStatus?.isConnected ?? false;
  const channelName = channelStatus?.channelName ?? '';

  if (!identity) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
        <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground">Checking...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
        <CheckCircle size={14} className="text-green-400" />
        <span className="text-xs text-green-300 font-medium truncate max-w-[120px]">
          {channelName || 'Connected'}
        </span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              size="sm"
              onClick={() => connectChannel()}
              disabled={!isConfigured}
              className="bg-red-600/80 hover:bg-red-600 text-white border-0 gap-1.5 text-xs h-8"
            >
              <Youtube size={14} />
              Connect YouTube
            </Button>
          </span>
        </TooltipTrigger>
        {!isConfigured && (
          <TooltipContent className="bg-dark-800 border-white/10 text-white text-xs max-w-xs">
            Configure VITE_GOOGLE_CLIENT_ID in your .env file to enable YouTube connection.
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

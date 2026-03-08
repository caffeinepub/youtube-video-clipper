import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, X, Youtube } from "lucide-react";
import React from "react";
import { useYouTubeChannel } from "../hooks/useYouTubeChannel";

export default function ChannelConnection() {
  const {
    channelStatus,
    isLoading,
    connectChannel,
    isConnecting,
    disconnectChannel,
    isDisconnecting,
  } = useYouTubeChannel();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking…</span>
      </div>
    );
  }

  if (channelStatus.isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-sm border border-green-500/20">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium truncate max-w-[120px]">
            {channelStatus.channelName || "YouTube Connected"}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnectChannel()}
          disabled={isDisconnecting}
          data-ocid="dashboard.youtube_disconnect.button"
          className="flex items-center gap-1 border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-colors h-8 px-2 text-xs"
        >
          {isDisconnecting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <X className="w-3 h-3" />
          )}
          <span>{isDisconnecting ? "..." : "Disconnect"}</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => connectChannel()}
      disabled={isConnecting}
      data-ocid="dashboard.youtube_connect.button"
      className="flex items-center gap-2 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 transition-colors"
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Youtube className="w-4 h-4" />
      )}
      <span>{isConnecting ? "Connecting…" : "Connect YouTube"}</span>
    </Button>
  );
}

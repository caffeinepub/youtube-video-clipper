import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Youtube } from "lucide-react";
import React from "react";
import { useYouTubeChannel } from "../hooks/useYouTubeChannel";

export default function ChannelConnection() {
  const { channelStatus, isLoading, connectChannel, isConnecting } =
    useYouTubeChannel();

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
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-sm border border-green-500/20">
        <CheckCircle className="w-4 h-4" />
        <span className="font-medium truncate max-w-[120px]">
          {channelStatus.channelName || "YouTube Connected"}
        </span>
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

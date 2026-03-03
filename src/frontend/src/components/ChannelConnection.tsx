import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader2, Youtube } from "lucide-react";
import React from "react";
import { useYouTubeChannel } from "../hooks/useYouTubeChannel";

export default function ChannelConnection() {
  const { channelStatus, isLoading, connectChannel, isConnecting } =
    useYouTubeChannel();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking connection…</span>
      </div>
    );
  }

  if (channelStatus.isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success text-sm border border-success/20">
        <CheckCircle className="w-4 h-4" />
        <span className="font-medium">
          {channelStatus.channelName
            ? channelStatus.channelName
            : "YouTube Connected"}
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
      className="flex items-center gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      <Youtube className="w-4 h-4" />
      <span>{isConnecting ? "Connecting…" : "Connect YouTube"}</span>
    </Button>
  );
}

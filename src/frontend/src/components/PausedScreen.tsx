import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { PauseCircle, RefreshCw } from "lucide-react";
import React from "react";

const DEFAULT_SHUTDOWN_MESSAGE =
  "Beast Clipping is currently down. Please wait for it to come back online.";

function getShutdownMessage(): string {
  try {
    return (
      localStorage.getItem("beast_shutdown_message") || DEFAULT_SHUTDOWN_MESSAGE
    );
  } catch {
    return DEFAULT_SHUTDOWN_MESSAGE;
  }
}

export default function PausedScreen() {
  const queryClient = useQueryClient();
  const shutdownMessage = getShutdownMessage();

  const handleCheckAgain = () => {
    queryClient.invalidateQueries({ queryKey: ["systemStatus"] });
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <PauseCircle className="w-10 h-10 text-indigo-400" />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white font-display">
            Beast Clipping
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {shutdownMessage}
          </p>
        </div>

        {/* Check again */}
        <Button
          variant="outline"
          onClick={handleCheckAgain}
          className="gap-2 border-white/10 text-white hover:bg-white/5"
        >
          <RefreshCw className="w-4 h-4" />
          Check Again
        </Button>

        {/* Admin hint */}
        <p className="text-xs text-muted-foreground/60">
          If you are an admin, please log in to resume the application.
        </p>

        {/* Footer */}
        <p className="text-muted-foreground/40 text-xs">
          © {new Date().getFullYear()} Beast Clipping
        </p>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { MessageSquare, PauseCircle, RefreshCw } from "lucide-react";
import React from "react";
import { toast } from "sonner";

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

  const handleContactAdmin = () => {
    toast.info(
      "Please log in with your account to send a message to an admin.",
      {
        duration: 5000,
      },
    );
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

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <Button
            variant="outline"
            onClick={handleCheckAgain}
            className="gap-2 border-white/10 text-white hover:bg-white/5 w-full"
            data-ocid="paused.secondary_button"
          >
            <RefreshCw className="w-4 h-4" />
            Check Again
          </Button>
          <Button
            variant="ghost"
            onClick={handleContactAdmin}
            className="gap-2 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200 w-full"
            data-ocid="paused.primary_button"
          >
            <MessageSquare className="w-4 h-4" />
            Message an Admin
          </Button>
        </div>

        {/* Admin hint */}
        <p className="text-xs text-muted-foreground/60 text-center max-w-xs">
          If you are an admin, please log in to resume the application.
          <br />
          <span className="text-indigo-400/70">
            Regular users: log in and use the Messages tab to reach an admin.
          </span>
        </p>

        {/* Footer */}
        <p className="text-muted-foreground/40 text-xs">
          © {new Date().getFullYear()} Beast Clipping
        </p>
      </div>
    </div>
  );
}

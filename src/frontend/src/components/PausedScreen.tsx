import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  MessageSquare,
  PauseCircle,
  RefreshCw,
  Send,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { SubmissionType } from "../backend";
import { useActor } from "../hooks/useActor";

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
  const { actor } = useActor();
  const shutdownMessage = getShutdownMessage();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleCheckAgain = () => {
    queryClient.invalidateQueries({ queryKey: ["systemStatus"] });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    if (!actor) {
      toast.error("Not connected. Please refresh and try again.");
      return;
    }
    setIsSending(true);
    try {
      await actor.submitFeedback(
        SubmissionType.BugReport,
        "Message from paused screen",
        message.trim(),
      );
      toast.success("Message sent to admins!");
      setMessage("");
      setShowForm(false);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
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
            onClick={() => setShowForm(!showForm)}
            className="gap-2 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200 w-full"
            data-ocid="paused.primary_button"
          >
            <MessageSquare className="w-4 h-4" />
            {showForm ? "Hide Form" : "Message an Admin"}
          </Button>
        </div>

        {/* Inline contact form */}
        {showForm && (
          <div className="w-full max-w-xs space-y-3" data-ocid="paused.panel">
            <Textarea
              placeholder="Describe your issue or reason for contact..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-white/5 border-indigo-500/20 text-white placeholder:text-muted-foreground/50 focus:border-indigo-500/50 text-sm resize-none min-h-[100px]"
              disabled={isSending}
              data-ocid="paused.textarea"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isSending || !message.trim()}
              className="w-full gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
              data-ocid="paused.submit_button"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        )}

        {/* Admin hint */}
        <p className="text-xs text-muted-foreground/60 text-center max-w-xs">
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

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  Inbox,
  Loader2,
  MessageSquare,
  Reply,
  Send,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { AdminMessage } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { generateShortUserId } from "../utils/userIdGenerator";

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserMessages() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(
    null,
  );
  const [replyingTo, setReplyingTo] = useState<AdminMessage | null>(null);
  const [replyBody, setReplyBody] = useState("");

  const principalStr = identity?.getPrincipal().toString() ?? "";
  const myUserId = principalStr ? generateShortUserId(principalStr) : "";

  const { data: messages, isLoading } = useQuery<AdminMessage[]>({
    queryKey: ["myMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyMessages(myUserId);
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 15_000,
  });

  const replyMutation = useMutation({
    mutationFn: async ({
      messageId,
      body,
    }: { messageId: string; body: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.replyToMessage(messageId, body, myUserId);
    },
    onSuccess: () => {
      toast.success("Reply sent!");
      setReplyingTo(null);
      setReplyBody("");
      queryClient.invalidateQueries({ queryKey: ["myMessages"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to send reply", { description: err.message });
    },
  });

  const handleReplySubmit = () => {
    if (!replyingTo || !replyBody.trim()) return;
    replyMutation.mutate({ messageId: replyingTo.id, body: replyBody.trim() });
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white font-display">
            Messages
          </h3>
        </div>
        {["s1", "s2"].map((k) => (
          <Skeleton key={k} className="h-16 w-full rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return null;
  }

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selectedMessage) {
    const senderUserId = selectedMessage.fromUserId
      ? selectedMessage.fromUserId
      : generateShortUserId(selectedMessage.fromPrincipal);

    return (
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-4">
        {/* Back */}
        <button
          type="button"
          onClick={() => {
            setSelectedMessage(null);
            setReplyingTo(null);
            setReplyBody("");
          }}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to messages
        </button>

        {/* Message detail */}
        <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-indigo-300">
              From: {senderUserId}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock size={10} />
              <span>{formatDate(selectedMessage.sentAt)}</span>
            </div>
          </div>
          <p className="text-sm text-white/90 whitespace-pre-wrap">
            {selectedMessage.body}
          </p>
        </div>

        {/* Reply section */}
        {replyingTo?.id === selectedMessage.id ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-white">
              Reply to {senderUserId}
            </p>
            <Textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Type your reply…"
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-sm resize-none"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleReplySubmit}
                disabled={replyMutation.isPending || !replyBody.trim()}
                className="bg-indigo-500 hover:bg-indigo-600 text-white gap-1"
              >
                {replyMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Send Reply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyBody("");
                }}
                className="text-muted-foreground hover:text-white gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setReplyingTo(selectedMessage)}
            className="self-start text-indigo-300 hover:text-indigo-200 hover:bg-indigo-500/10 gap-1"
          >
            <Reply className="w-3.5 h-3.5" />
            Reply
          </Button>
        )}
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <MessageSquare size={16} className="text-indigo-400" />
        <h3 className="text-sm font-semibold text-white font-display">
          Messages
        </h3>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium">
          {messages.length}
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
        {messages.map((msg) => {
          const senderUserId = msg.fromUserId
            ? msg.fromUserId
            : generateShortUserId(msg.fromPrincipal);

          return (
            <button
              type="button"
              key={msg.id}
              className="w-full text-left p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 cursor-pointer hover:bg-indigo-500/10 transition-colors"
              onClick={() => setSelectedMessage(msg)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-indigo-300">
                  From: {senderUserId}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock size={10} />
                  <span>{formatDate(msg.sentAt)}</span>
                </div>
              </div>
              <p className="text-sm text-white/90 line-clamp-2">{msg.body}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="flex items-center gap-1 text-xs text-indigo-400">
                  <Reply className="w-3 h-3" />
                  Reply
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Tap to open →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

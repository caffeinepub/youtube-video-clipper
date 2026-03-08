import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, LogIn, MessageSquare, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AdminMessage } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { generateShortUserId } from "../utils/userIdGenerator";

function formatTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 86_400_000) return "Today";
  if (diff < 172_800_000) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(userId: string): string {
  return userId.slice(0, 2).toUpperCase();
}

interface Conversation {
  senderId: string; // fromPrincipal or fromUserId
  senderLabel: string; // short display label
  messages: AdminMessage[];
  latestMessage: AdminMessage;
}

function groupByConversation(
  messages: AdminMessage[],
  myPrincipal: string,
): Conversation[] {
  const map = new Map<string, AdminMessage[]>();

  for (const msg of messages) {
    // Group by the "other party" principal
    const otherId =
      msg.fromPrincipal === myPrincipal ? msg.toPrincipal : msg.fromPrincipal;
    const key = otherId || msg.fromPrincipal;
    const existing = map.get(key) ?? [];
    existing.push(msg);
    map.set(key, existing);
  }

  const convs: Conversation[] = [];
  for (const [senderId, msgs] of map.entries()) {
    const sorted = [...msgs].sort(
      (a, b) => Number(a.sentAt) - Number(b.sentAt),
    );
    const latest = sorted[sorted.length - 1];
    const senderLabel =
      latest.fromPrincipal !== myPrincipal
        ? latest.fromUserId || generateShortUserId(latest.fromPrincipal)
        : latest.toUserId || generateShortUserId(latest.toPrincipal);

    convs.push({
      senderId,
      senderLabel,
      messages: sorted,
      latestMessage: latest,
    });
  }

  // Sort conversations newest first
  return convs.sort(
    (a, b) => Number(b.latestMessage.sentAt) - Number(a.latestMessage.sentAt),
  );
}

export default function MessagesPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [showMobileThread, setShowMobileThread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const myPrincipal = identity?.getPrincipal().toString() ?? "";
  const myUserId = myPrincipal ? generateShortUserId(myPrincipal) : "";

  const { data: messages = [], isLoading } = useQuery<AdminMessage[]>({
    queryKey: ["myMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyMessages(myUserId);
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 15_000,
  });

  const conversations = groupByConversation(messages, myPrincipal);
  const selectedConv =
    conversations.find((c) => c.senderId === selectedConvId) ?? null;

  // Auto-select first conversation
  useEffect(() => {
    if (!selectedConvId && conversations.length > 0) {
      setSelectedConvId(conversations[0].senderId);
    }
  }, [conversations, selectedConvId]);

  // Scroll to bottom when thread changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — only scroll when message count changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages.length]);

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
      setReplyBody("");
      queryClient.invalidateQueries({ queryKey: ["myMessages"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to send reply", { description: err.message });
    },
  });

  const handleSendReply = () => {
    if (!selectedConv || !replyBody.trim()) return;
    const lastMsg = selectedConv.latestMessage;
    replyMutation.mutate({ messageId: lastMsg.id, body: replyBody.trim() });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <MessageSquare className="w-12 h-12 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-semibold text-white">
          Sign in to view messages
        </h2>
        <p className="text-muted-foreground text-sm text-center">
          You need to be logged in to access your messages.
        </p>
        <Button
          onClick={() => login()}
          disabled={loginStatus === "logging-in"}
          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
          data-ocid="messages.primary_button"
        >
          <LogIn className="w-4 h-4" />
          {loginStatus === "logging-in" ? "Logging in…" : "Login"}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col p-4 md:p-6 gap-0">
      {/* Page title — only on desktop or when list is visible */}
      <div
        className={`flex items-center gap-3 mb-4 ${showMobileThread ? "hidden md:flex" : "flex"}`}
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-white font-bold text-2xl font-display">
            Messages
          </h1>
          <p className="text-muted-foreground text-sm">Your conversations</p>
        </div>
      </div>

      {/* Discord-style two-panel layout */}
      <div className="flex flex-1 min-h-0 rounded-2xl overflow-hidden border border-white/8 bg-[#0B0E14]">
        {/* ── Left sidebar: conversation list ── */}
        <div
          className={`w-full md:w-64 border-r border-white/8 flex flex-col bg-[#0d0f1a] ${
            showMobileThread ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-3 border-b border-white/8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Direct Messages
            </p>
          </div>
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              </div>
            ) : conversations.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3"
                data-ocid="messages.empty_state"
              >
                <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">No messages yet</p>
                <p className="text-muted-foreground/60 text-xs">
                  Messages from admins will appear here
                </p>
              </div>
            ) : (
              <div className="py-1">
                {conversations.map((conv, idx) => {
                  const isSelected = selectedConvId === conv.senderId;
                  const preview =
                    conv.latestMessage.body.length > 50
                      ? `${conv.latestMessage.body.slice(0, 50)}…`
                      : conv.latestMessage.body;

                  return (
                    <button
                      key={conv.senderId}
                      type="button"
                      onClick={() => {
                        setSelectedConvId(conv.senderId);
                        setShowMobileThread(true);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                        isSelected
                          ? "bg-indigo-500/20 border-r-2 border-indigo-500"
                          : "hover:bg-white/5"
                      }`}
                      data-ocid={`messages.item.${idx + 1}`}
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-indigo-500/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-300 text-xs font-bold">
                          {getInitials(conv.senderLabel)}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isSelected ? "text-indigo-300" : "text-white/80"
                          }`}
                        >
                          {conv.senderLabel}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {preview}
                        </p>
                      </div>
                      {/* Timestamp */}
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {formatTime(conv.latestMessage.sentAt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* ── Right panel: message thread ── */}
        <div
          className={`flex-1 flex flex-col min-w-0 ${
            !showMobileThread ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedConv ? (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 p-3 border-b border-white/8 bg-[#0d0f1a]">
                {/* Back button (mobile) */}
                <button
                  type="button"
                  onClick={() => setShowMobileThread(false)}
                  className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                  data-ocid="messages.cancel_button"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-300 text-xs font-bold">
                    {getInitials(selectedConv.senderLabel)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {selectedConv.senderLabel}
                  </p>
                  <p className="text-muted-foreground text-xs font-mono">
                    {selectedConv.senderId.length > 20
                      ? `${selectedConv.senderId.slice(0, 14)}...${selectedConv.senderId.slice(-6)}`
                      : selectedConv.senderId}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Group by date */}
                  {(() => {
                    const groups: { date: string; msgs: AdminMessage[] }[] = [];
                    for (const msg of selectedConv.messages) {
                      const d = formatDate(msg.sentAt);
                      const last = groups[groups.length - 1];
                      if (!last || last.date !== d) {
                        groups.push({ date: d, msgs: [msg] });
                      } else {
                        last.msgs.push(msg);
                      }
                    }
                    return groups.map((group) => (
                      <div key={group.date}>
                        {/* Date divider */}
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-white/8" />
                          <span className="text-xs text-muted-foreground px-2">
                            {group.date}
                          </span>
                          <div className="flex-1 h-px bg-white/8" />
                        </div>
                        {group.msgs.map((msg) => {
                          const isMe = msg.fromPrincipal === myPrincipal;
                          const senderLabel = isMe
                            ? "You"
                            : msg.fromUserId ||
                              generateShortUserId(msg.fromPrincipal);

                          return (
                            <div
                              key={msg.id}
                              className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                            >
                              {/* Avatar */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                  isMe
                                    ? "bg-primary/30 border border-primary/40 text-primary"
                                    : "bg-indigo-500/30 border border-indigo-500/40 text-indigo-300"
                                }`}
                              >
                                {getInitials(senderLabel)}
                              </div>
                              {/* Bubble */}
                              <div
                                className={`max-w-[70%] space-y-1 ${isMe ? "items-end" : "items-start"} flex flex-col`}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs font-medium ${
                                      isMe ? "text-primary" : "text-indigo-300"
                                    }`}
                                  >
                                    {senderLabel}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {formatTime(msg.sentAt)}
                                  </span>
                                </div>
                                <div
                                  className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                                    isMe
                                      ? "bg-primary/20 border border-primary/30 text-white rounded-tr-sm"
                                      : "bg-indigo-500/10 border border-indigo-500/20 text-white/90 rounded-tl-sm"
                                  }`}
                                >
                                  {msg.body}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              {/* Reply input bar */}
              <div className="p-3 border-t border-white/8 bg-[#0d0f1a]">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder={`Reply to ${selectedConv.senderLabel}…`}
                    rows={1}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-sm resize-none min-h-[40px] max-h-[120px] focus:border-indigo-500/50"
                    data-ocid="messages.textarea"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendReply}
                    disabled={replyMutation.isPending || !replyBody.trim()}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white h-10 w-10 flex-shrink-0"
                    data-ocid="messages.submit_button"
                  >
                    {replyMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">
                  Press Enter to send · Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            /* Empty state — no conversation selected */
            <div
              className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6"
              data-ocid="messages.empty_state"
            >
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-indigo-400/60" />
              </div>
              <div>
                <p className="text-white font-semibold">
                  Select a conversation
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Choose a message thread from the left to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

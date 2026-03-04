import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Megaphone, MessageSquare, Scissors, Zap } from "lucide-react";
import React from "react";
import { type Notification, NotificationType } from "../backend";
import { useActor } from "../hooks/useActor";

function formatTimeAgo(timestamp: bigint): string {
  const now = Date.now();
  const ts = Number(timestamp) / 1_000_000; // nanoseconds to ms
  const diff = now - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function NotificationIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case NotificationType.clip_processed:
      return <Scissors className="w-3.5 h-3.5 text-primary" />;
    case NotificationType.new_message:
      return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
    case NotificationType.reaction:
      return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
    case NotificationType.system_announcement:
      return <Megaphone className="w-3.5 h-3.5 text-orange-400" />;
    default:
      return <Bell className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

export default function NotificationBell() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyNotifications();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.markNotificationsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-primary transition-colors"
          data-ocid="notifications.button"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 bg-[#0d1020] border border-primary/20 shadow-neon p-0"
        data-ocid="notifications.dropdown_menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-white font-semibold text-sm">
              Notifications
            </span>
            {unreadCount > 0 && (
              <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs px-1.5 py-0">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markReadMutation.mutate()}
              disabled={markReadMutation.isPending}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
              data-ocid="notifications.button"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <ScrollArea className="max-h-72">
          {notifications.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-8 text-center"
              data-ocid="notifications.empty_state"
            >
              <Bell className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.slice(0, 10).map((notif, idx) => (
                <DropdownMenuItem
                  key={String(notif.id)}
                  className={`px-4 py-3 gap-3 cursor-default hover:bg-white/5 ${
                    !notif.read ? "bg-primary/5" : ""
                  }`}
                  data-ocid={`notifications.item.${idx + 1}`}
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                    <NotificationIcon type={notif.notificationType} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs leading-snug ${!notif.read ? "text-foreground font-medium" : "text-muted-foreground"}`}
                    >
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {formatTimeAgo(notif.timestamp)}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 neon-glow-sm" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

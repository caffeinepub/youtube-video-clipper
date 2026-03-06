/**
 * WarningBanner — shows a dismissible alert on the home screen when the
 * current user has unread warning notifications from admins.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, X } from "lucide-react";
import React from "react";
import { type Notification, NotificationType } from "../backend";
import { useActor } from "../hooks/useActor";

export default function WarningBanner() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyNotifications();
    },
    enabled: !!actor && !isFetching,
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

  // Only show unread system_announcement notifications that start with ⚠️
  const activeWarnings = notifications.filter(
    (n) =>
      !n.read &&
      n.notificationType === NotificationType.system_announcement &&
      n.message.startsWith("⚠️"),
  );

  if (activeWarnings.length === 0) return null;

  const handleDismiss = () => {
    markReadMutation.mutate();
  };

  return (
    <div
      className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-3 flex items-start gap-3"
      data-ocid="warning_banner.panel"
      role="alert"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center mt-0.5">
        <AlertTriangle className="w-4 h-4 text-yellow-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-yellow-300 font-semibold text-sm">
          {activeWarnings.length === 1
            ? "You have received a warning"
            : `You have ${activeWarnings.length} warnings`}
        </p>
        <div className="space-y-1 mt-1">
          {activeWarnings.map((w) => (
            <p
              key={String(w.id)}
              className="text-yellow-200/80 text-xs leading-snug"
            >
              {/* Strip the ⚠️ Warning: prefix for cleaner display */}
              {w.message.replace(/^⚠️\s*(Warning:\s*)?/i, "")}
            </p>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-lg text-yellow-400/60 hover:text-yellow-300 hover:bg-yellow-500/10 transition-all"
        title="Dismiss warnings"
        data-ocid="warning_banner.close_button"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

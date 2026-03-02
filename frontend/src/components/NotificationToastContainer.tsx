import React, { useEffect, useRef, useState } from 'react';
import { X, Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface ToastItem {
  id: string;
  message: string;
  type: string;
}

export default function NotificationToastContainer() {
  const { identity } = useInternetIdentity();
  const { notifications } = useNotifications();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!identity) return;
    notifications.forEach((notif) => {
      if (!notif.isRead && !seenIds.current.has(notif.id)) {
        seenIds.current.add(notif.id);
        const toast: ToastItem = { id: notif.id, message: notif.message, type: notif.type };
        setToasts((prev) => [...prev, toast]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== notif.id));
        }, 5000);
      }
    });
  }, [notifications, identity]);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto glass-card rounded-xl border border-cyan-neon/40 p-3 w-72 animate-slide-in-right shadow-neon"
        >
          <div className="flex items-start gap-2">
            <Bell className="w-4 h-4 text-cyan-neon shrink-0 mt-0.5" />
            <p className="text-sm text-foreground flex-1">{toast.message}</p>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

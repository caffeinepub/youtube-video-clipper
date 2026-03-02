import { useState, useCallback } from 'react';
import { useInternetIdentity } from './useInternetIdentity';

export interface Notification {
  id: string;
  message: string;
  type: string;
  timestamp: number;
  isRead: boolean;
}

// In-memory notification store (simulated since backend doesn't have notification methods)
let globalNotifications: Notification[] = [
  {
    id: 'welcome-1',
    message: '🎮 Welcome to Beast Clipping! Start creating epic gaming clips.',
    type: 'info',
    timestamp: Date.now() - 60000,
    isRead: false,
  },
  {
    id: 'feature-1',
    message: '⚡ New feature: Detect Hype automatically finds your best moments!',
    type: 'feature',
    timestamp: Date.now() - 120000,
    isRead: false,
  },
];

let listeners: Array<() => void> = [];

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function addNotification(message: string, type = 'info') {
  const notif: Notification = {
    id: `notif-${Date.now()}-${Math.random()}`,
    message,
    type,
    timestamp: Date.now(),
    isRead: false,
  };
  globalNotifications = [notif, ...globalNotifications];
  notifyListeners();
}

export function useNotifications() {
  const { identity } = useInternetIdentity();
  const [, forceUpdate] = useState(0);

  // Subscribe to changes
  const subscribe = useCallback(() => {
    const fn = () => forceUpdate((n) => n + 1);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }, []);

  // Auto-subscribe
  useState(() => {
    if (!identity) return;
    return subscribe();
  });

  const notifications = identity ? globalNotifications : [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = useCallback((id: string) => {
    globalNotifications = globalNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    notifyListeners();
    forceUpdate((n) => n + 1);
  }, []);

  const markAllRead = useCallback(() => {
    globalNotifications = globalNotifications.map((n) => ({ ...n, isRead: true }));
    notifyListeners();
    forceUpdate((n) => n + 1);
  }, []);

  return { notifications, unreadCount, markRead, markAllRead };
}

import React, { useState } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1.5 rounded-lg cyberpunk-btn transition-smooth"
      >
        <Bell className="w-4 h-4 text-cyan-neon" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-neon text-purple-deep text-xs font-bold rounded-full flex items-center justify-center font-orbitron">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 w-80 z-50 glass-card rounded-xl border border-cyan-neon/30 shadow-neon overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between p-3 border-b border-cyan-neon/20">
              <h3 className="font-orbitron text-xs text-cyan-neon">NOTIFICATIONS</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-cyan-neon/60 hover:text-cyan-neon transition-smooth flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    All read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto scrollbar-cyber">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`p-3 border-b border-cyan-neon/10 cursor-pointer transition-smooth hover:bg-cyan-neon/5 ${
                      !notif.isRead ? 'bg-cyan-neon/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-cyan-neon mt-1.5 shrink-0 animate-neon-pulse" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

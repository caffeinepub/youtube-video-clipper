import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Scissors, X } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../hooks/useLocalStorage";

export interface QueueItem {
  id: string;
  title: string;
  status: "processing" | "done" | "error";
  progress: number;
  createdAt: number;
  error?: string;
}

const QUEUE_KEY = "beastclipping_clip_queue";

export function getQueue(): QueueItem[] {
  return getLocalStorageItem<QueueItem[]>(QUEUE_KEY, []);
}

export function addToQueue(id: string, title: string): void {
  const queue = getQueue().filter((q) => q.status !== "done");
  const newItem: QueueItem = {
    id,
    title,
    status: "processing",
    progress: 0,
    createdAt: Date.now(),
  };
  setLocalStorageItem(QUEUE_KEY, [...queue, newItem]);
  window.dispatchEvent(new CustomEvent("clip-queue-update"));
}

export function markQueueItemDone(id: string): void {
  const queue = getQueue().map((q) =>
    q.id === id ? { ...q, status: "done" as const, progress: 100 } : q,
  );
  setLocalStorageItem(QUEUE_KEY, queue);
  window.dispatchEvent(new CustomEvent("clip-queue-update"));
}

export function markQueueItemError(id: string, error: string): void {
  const queue = getQueue().map((q) =>
    q.id === id ? { ...q, status: "error" as const, error } : q,
  );
  setLocalStorageItem(QUEUE_KEY, queue);
  window.dispatchEvent(new CustomEvent("clip-queue-update"));
}

function updateQueueProgress(id: string, progress: number): void {
  const queue = getQueue().map((q) => (q.id === id ? { ...q, progress } : q));
  setLocalStorageItem(QUEUE_KEY, queue);
}

export default function ClipQueue() {
  const [items, setItems] = useState<QueueItem[]>([]);

  const refresh = useCallback(() => {
    setItems(
      getQueue().filter(
        (q) => q.status !== "done" || Date.now() - q.createdAt < 10000,
      ),
    );
  }, []);

  useEffect(() => {
    refresh();

    const handler = () => refresh();
    window.addEventListener("clip-queue-update", handler);
    window.addEventListener("storage", handler);

    const interval = setInterval(() => {
      // Simulate progress for processing items
      const queue = getQueue();
      let changed = false;
      for (const q of queue) {
        if (q.status === "processing" && q.progress < 90) {
          updateQueueProgress(
            q.id,
            Math.min(90, q.progress + Math.random() * 15 + 5),
          );
          changed = true;
        }
      }
      if (changed) refresh();
    }, 600);

    return () => {
      window.removeEventListener("clip-queue-update", handler);
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, [refresh]);

  // Auto-dismiss done items
  useEffect(() => {
    const doneItems = items.filter((q) => q.status === "done");
    if (doneItems.length === 0) return;

    const timeout = setTimeout(() => {
      const queue = getQueue().filter((q) => q.status !== "done");
      setLocalStorageItem(QUEUE_KEY, queue);
      refresh();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [items, refresh]);

  const removeItem = (id: string) => {
    const queue = getQueue().filter((q) => q.id !== id);
    setLocalStorageItem(QUEUE_KEY, queue);
    refresh();
  };

  if (items.length === 0) return null;

  return (
    <div className="glass-card p-4 space-y-3" data-ocid="clip.queue.panel">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Scissors className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <h3 className="text-white font-semibold text-sm">Clip Queue</h3>
        <span className="ml-auto bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">
          {items.filter((i) => i.status === "processing").length} processing
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
              item.status === "done"
                ? "bg-green-500/5 border-green-500/20"
                : item.status === "error"
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-white/3 border-white/8"
            }`}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {item.status === "done" ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : item.status === "error" ? (
                <X className="w-4 h-4 text-red-400" />
              ) : (
                <div className="w-4 h-4 border-2 border-indigo-400/60 border-t-indigo-400 rounded-full animate-spin" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {item.title}
              </p>
              {item.status === "processing" && (
                <div className="mt-1">
                  <Progress
                    value={item.progress}
                    className="h-1 bg-white/10 [&>[role=progressbar]]:bg-indigo-400"
                  />
                </div>
              )}
              {item.status === "done" && (
                <p className="text-green-400 text-xs mt-0.5">Ready ✓</p>
              )}
              {item.status === "error" && (
                <p className="text-red-400 text-xs mt-0.5 truncate">
                  {item.error || "Failed"}
                </p>
              )}
            </div>

            {/* Status label */}
            <div className="flex-shrink-0 flex items-center gap-1">
              {item.status === "processing" && (
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.round(item.progress)}%
                </span>
              )}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-0.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

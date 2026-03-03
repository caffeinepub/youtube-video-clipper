import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Eye, Loader2, Scissors, Search } from "lucide-react";
import React, { useState, useMemo } from "react";
import type { VideoClip } from "../backend";
import {
  type ClipCategory,
  getAllViewCounts,
  getClipTags,
  getViewCount,
  isClipExpired,
  isFavorite,
} from "../hooks/useClipExtras";
import { useClips } from "../hooks/useClips";
import ClipCard from "./ClipCard";

interface ClipListProps {
  onClipSelect?: (clip: VideoClip) => void;
}

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "favorites", label: "⭐ Favorites" },
  { value: "Funny", label: "😂 Funny" },
  { value: "Hype", label: "🔥 Hype" },
  { value: "Fail", label: "💀 Fail" },
  { value: "Gaming", label: "🎮 Gaming" },
  { value: "Other", label: "Other" },
];

function PerformanceDashboard({ clips }: { clips: VideoClip[] }) {
  const allViews = getAllViewCounts();
  const clipsWithViews = clips
    .map((c) => ({ ...c, views: allViews[c.id] || 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const maxViews = Math.max(...clipsWithViews.map((c) => c.views), 1);

  if (clipsWithViews.length === 0) {
    return (
      <div
        className="text-center py-8 text-muted-foreground text-sm"
        data-ocid="analytics.empty_state"
      >
        No view data yet. Open some clips to track views!
      </div>
    );
  }

  return (
    <div className="space-y-2" data-ocid="analytics.panel">
      <div className="flex items-center gap-2 mb-3">
        <BarChart2 className="w-4 h-4 text-indigo-400" />
        <h3 className="text-white font-semibold text-sm">Top Clips by Views</h3>
      </div>
      {clipsWithViews.map((clip) => (
        <div key={clip.id} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground/80 truncate max-w-[200px]">
              {clip.title}
            </span>
            <span className="text-indigo-400 font-mono flex items-center gap-1 flex-shrink-0 ml-2">
              <Eye className="w-3 h-3" />
              {clip.views}
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(clip.views / maxViews) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ClipList({ onClipSelect }: ClipListProps) {
  const {
    data: clips,
    isLoading,
    error,
    deleteClip,
    isDeletingId,
  } = useClips();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(() => {
    if (!clips) return [];

    let result = clips;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q));
    }

    // Tab filter
    if (activeTab === "favorites") {
      result = result.filter((c) => isFavorite(c.id));
    } else if (activeTab !== "all") {
      result = result.filter((c) =>
        getClipTags(c.id).includes(activeTab as ClipCategory),
      );
    }

    return result;
  }, [clips, search, activeTab]);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-8"
        data-ocid="clips.loading_state"
      >
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" data-ocid="clips.error_state">
        <p className="text-red-400 text-sm">Failed to load clips</p>
      </div>
    );
  }

  if (!clips || clips.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 text-center"
        data-ocid="clips.empty_state"
      >
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
          <Scissors className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm font-medium">
          No clips yet
        </p>
        <p className="text-muted-foreground/60 text-xs mt-1">
          Load a YouTube video and create your first clip
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search clips…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-indigo-500/60"
          data-ocid="clips.search_input"
        />
      </div>

      {/* Tabs for filter + Performance */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto scrollbar-thin -mx-1 px-1">
          <TabsList className="bg-white/5 border border-white/10 inline-flex gap-0.5 h-auto p-1 flex-nowrap">
            {FILTER_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs px-2.5 py-1.5 whitespace-nowrap data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300 data-[state=active]:border-indigo-500/30"
                data-ocid="clips.tab"
              >
                {tab.label}
              </TabsTrigger>
            ))}
            <TabsTrigger
              value="performance"
              className="text-xs px-2.5 py-1.5 whitespace-nowrap data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300 data-[state=active]:border-indigo-500/30"
              data-ocid="clips.tab"
            >
              📊 Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Performance tab */}
        <TabsContent value="performance" className="mt-4">
          <PerformanceDashboard clips={clips} />
        </TabsContent>

        {/* All other tabs show filtered clips */}
        {FILTER_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-8 text-center"
                data-ocid="clips.empty_state"
              >
                <Scissors className="w-6 h-6 text-muted-foreground/40 mb-2" />
                <p className="text-muted-foreground text-sm">
                  {search.trim()
                    ? "No clips match your search"
                    : "No clips in this category"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((clip, idx) => {
                  const expired = isClipExpired(clip.id);
                  return (
                    <div
                      key={clip.id}
                      onClick={() => onClipSelect?.(clip)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && onClipSelect?.(clip)
                      }
                      role={onClipSelect ? "button" : undefined}
                      tabIndex={onClipSelect ? 0 : undefined}
                      className={`${onClipSelect ? "cursor-pointer" : ""} ${expired ? "opacity-60" : ""}`}
                      data-ocid={`clips.item.${idx + 1}`}
                    >
                      <ClipCard
                        clip={clip}
                        onDelete={(id) => deleteClip(id)}
                        isDeleting={isDeletingId === clip.id}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

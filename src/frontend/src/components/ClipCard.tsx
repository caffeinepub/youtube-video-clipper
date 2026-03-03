import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Check,
  Clock,
  Copy,
  Download,
  Eye,
  Flame,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Share2,
  Star,
  Tag,
  Youtube,
} from "lucide-react";
import React, { useState, useCallback } from "react";
import { SiReddit, SiX } from "react-icons/si";
import { toast } from "sonner";
import type { VideoClip } from "../backend";
import {
  type ClipCategory,
  type ExpiryOption,
  getClipExpiry,
  getClipTags,
  getCommentCount,
  getReactions,
  getViewCount,
  incrementViewCount,
  isClipExpired,
  isFavorite,
  setClipExpiry,
  toggleClipTag,
  toggleFavorite,
  toggleReaction as toggleReactionUtil,
} from "../hooks/useClipExtras";
import { useDownloadClip } from "../hooks/useDownloadClip";
import { usePostToYouTube } from "../hooks/usePostToYouTube";
import CommentsModal from "./CommentsModal";
import ViralScoreBadge from "./ViralScoreBadge";

const CATEGORY_COLORS: Record<ClipCategory, string> = {
  Funny: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Hype: "bg-red-500/20 text-red-300 border-red-500/30",
  Fail: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Gaming: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const ALL_CATEGORIES: ClipCategory[] = [
  "Funny",
  "Hype",
  "Fail",
  "Gaming",
  "Other",
];

const EXPIRY_OPTIONS: { label: string; value: ExpiryOption }[] = [
  { label: "No expiry", value: "none" },
  { label: "7 days", value: "7days" },
  { label: "30 days", value: "30days" },
  { label: "90 days", value: "90days" },
];

function CopyPrincipalButton({ principal }: { principal: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(principal);
      setCopied(true);
      toast.success("Principal ID copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-1 p-0.5 rounded hover:bg-white/10 transition-colors text-white/50 hover:text-white/80"
      title="Copy principal ID"
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-400" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

interface ClipCardProps {
  clip: VideoClip;
  onDelete?: (clipId: string) => void;
  isDeleting?: boolean;
  isAdminView?: boolean;
  ownerPrincipal?: string;
}

export default function ClipCard({
  clip,
  onDelete,
  isDeleting,
  isAdminView = false,
  ownerPrincipal,
}: ClipCardProps) {
  const downloadMutation = useDownloadClip();
  const postToYouTubeMutation = usePostToYouTube();

  // ── Local reactive state ──────────────────────────────────────────────────
  const [fav, setFav] = useState(() => isFavorite(clip.id));
  const [tags, setTags] = useState<ClipCategory[]>(() => getClipTags(clip.id));
  const [reactions, setReactions] = useState(() => getReactions(clip.id));
  const [commentCount, setCommentCount] = useState(() =>
    getCommentCount(clip.id),
  );
  const [expiry, setExpiryState] = useState(() => getClipExpiry(clip.id));
  const [viewCount, setViewCount] = useState(() => getViewCount(clip.id));
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);

  const expired = isClipExpired(clip.id);

  const startSec = Number(clip.startTime);
  const endSec = Number(clip.endTime);
  const duration = endSec - startSec;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatDuration = (secs: number) => {
    if (secs < 60) return `${secs}s`;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  const videoId = (() => {
    try {
      const url = new URL(clip.videoUrl);
      return (
        url.searchParams.get("v") ||
        url.pathname.split("/").pop() ||
        clip.videoUrl
      );
    } catch {
      return clip.videoUrl;
    }
  })();

  const thumbnailUrl =
    clip.thumbnailUrl ||
    (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "");

  const clipPublicUrl = `${window.location.origin}/clips/${clip.id}`;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleToggleFav = useCallback(() => {
    const next = toggleFavorite(clip.id);
    setFav(next);
    toast.success(next ? "⭐ Added to favorites" : "Removed from favorites");
  }, [clip.id]);

  const handleToggleTag = useCallback(
    (tag: ClipCategory) => {
      const next = toggleClipTag(clip.id, tag);
      setTags(next);
    },
    [clip.id],
  );

  const handleToggleReaction = useCallback(() => {
    const next = toggleReactionUtil(clip.id);
    setReactions(next);
    if (next.reacted) toast("🔥 Reacted!");
  }, [clip.id]);

  const handleOpenComments = useCallback(() => {
    setViewCount(incrementViewCount(clip.id));
    setCommentsOpen(true);
  }, [clip.id]);

  const handleCopyShareLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(clipPublicUrl);
      toast.success("🔗 Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  }, [clipPublicUrl]);

  const handleShareToX = useCallback(() => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this clip: "${clip.title}"`)}&url=${encodeURIComponent(clipPublicUrl)}`;
    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  }, [clip.title, clipPublicUrl]);

  const handleShareToReddit = useCallback(() => {
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(clipPublicUrl)}&title=${encodeURIComponent(clip.title)}`;
    window.open(redditUrl, "_blank", "noopener,noreferrer");
  }, [clip.title, clipPublicUrl]);

  const handleShareToDiscord = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(clipPublicUrl);
      toast.success("📋 Copied for Discord!");
    } catch {
      toast.error("Failed to copy");
    }
  }, [clipPublicUrl]);

  const handleSetExpiry = useCallback(
    (option: ExpiryOption) => {
      setClipExpiry(clip.id, option);
      setExpiryState(getClipExpiry(clip.id));
      const label = EXPIRY_OPTIONS.find((o) => o.value === option)?.label;
      toast.success(`Expiry set: ${label}`);
    },
    [clip.id],
  );

  const handleDownload = () => {
    downloadMutation.mutate({
      videoId,
      startTime: startSec,
      endTime: endSec,
      title: clip.title,
    });
  };

  const handlePostToYouTube = () => {
    postToYouTubeMutation.mutate({
      videoId,
      startTimestamp: BigInt(startSec),
      endTimestamp: BigInt(endSec),
      title: clip.title,
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div
        className={`group relative rounded-xl overflow-hidden bg-card border transition-all duration-200 shadow-sm hover:shadow-md ${
          expired
            ? "border-orange-500/30 opacity-60"
            : "border-border hover:border-primary/40"
        }`}
        data-ocid="clip.card"
      >
        {/* Expired banner */}
        {expired && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-orange-500/80 text-white text-xs text-center py-0.5 font-medium">
            ⏱ Expired
          </div>
        )}

        {/* Thumbnail */}
        <button
          type="button"
          className="relative w-full aspect-video bg-muted overflow-hidden cursor-pointer"
          onClick={() => setViewCount(incrementViewCount(clip.id))}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={clip.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Youtube className="w-8 h-8" />
            </div>
          )}

          {/* Viral badge */}
          <div className="absolute top-2 right-2">
            <ViralScoreBadge score={clip.score} />
          </div>

          {/* Time range */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
            {formatTime(startSec)} – {formatTime(endSec)}
          </div>

          {/* Duration pill */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
            {formatDuration(duration)}
          </div>

          {/* Favorite star overlay */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFav();
            }}
            className="absolute top-2 left-2 p-1 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
            title={fav ? "Remove from favorites" : "Add to favorites"}
            data-ocid="clip.toggle"
          >
            <Star
              className={`w-3.5 h-3.5 transition-colors ${
                fav
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-white/70 hover:text-yellow-300"
              }`}
            />
          </button>
        </button>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Title row */}
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug flex-1">
              {clip.title}
            </h3>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[tag]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Admin: owner principal */}
          {isAdminView && ownerPrincipal && (
            <div className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1">
              <span
                className="text-xs text-muted-foreground font-mono truncate max-w-[160px]"
                title={ownerPrincipal}
              >
                Owner: {ownerPrincipal.slice(0, 12)}…
              </span>
              <CopyPrincipalButton principal={ownerPrincipal} />
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {/* View count */}
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {viewCount} view{viewCount !== 1 ? "s" : ""}
            </span>
            {/* Reactions */}
            <button
              type="button"
              onClick={handleToggleReaction}
              className={`flex items-center gap-1 transition-colors hover:text-orange-400 ${
                reactions.reacted ? "text-orange-400" : ""
              }`}
              data-ocid="clip.toggle"
              title="React"
            >
              <Flame
                className={`w-3 h-3 ${reactions.reacted ? "fill-orange-400" : ""}`}
              />
              {reactions.count}
            </button>
            {/* Comments */}
            <button
              type="button"
              onClick={handleOpenComments}
              className="flex items-center gap-1 transition-colors hover:text-indigo-400"
              data-ocid="clip.open_modal_button"
              title="Comments"
            >
              <MessageSquare className="w-3 h-3" />
              {commentCount}
            </button>
            {/* Expiry indicator */}
            {expiry.option !== "none" && expiry.expiresAt && (
              <span
                className={`flex items-center gap-1 ${expired ? "text-orange-400" : "text-muted-foreground"}`}
              >
                <Clock className="w-3 h-3" />
                {expired
                  ? "Expired"
                  : EXPIRY_OPTIONS.find((o) => o.value === expiry.option)
                      ?.label}
              </span>
            )}
          </div>

          {/* Primary actions */}
          <div className="flex items-center gap-1.5 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
              className="flex-1 text-xs h-8"
              data-ocid="clip.button"
            >
              {downloadMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Download className="w-3 h-3 mr-1" />
              )}
              Download
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePostToYouTube}
              disabled={postToYouTubeMutation.isPending}
              className="flex-1 text-xs h-8 border-red-500/30 text-red-400 hover:bg-red-500/10"
              data-ocid="clip.button"
            >
              {postToYouTubeMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Youtube className="w-3 h-3 mr-1" />
              )}
              Post
            </Button>

            {/* More options dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-white"
                  data-ocid="clip.dropdown_menu"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#0B0E14] border border-white/10 text-white min-w-[160px]"
              >
                {/* Share */}
                <DropdownMenuItem
                  onClick={handleCopyShareLink}
                  className="gap-2 cursor-pointer hover:bg-white/5 text-xs"
                  data-ocid="clip.button"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  Copy Share Link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleShareToX}
                  className="gap-2 cursor-pointer hover:bg-white/5 text-xs"
                >
                  <SiX className="w-3.5 h-3.5" />
                  Share to X / Twitter
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleShareToDiscord}
                  className="gap-2 cursor-pointer hover:bg-white/5 text-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#5865F2]" />
                  Copy for Discord
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleShareToReddit}
                  className="gap-2 cursor-pointer hover:bg-white/5 text-xs"
                >
                  <SiReddit className="w-3.5 h-3.5 text-orange-400" />
                  Share to Reddit
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                {/* Tags submenu trigger */}
                <DropdownMenuItem
                  onClick={() => setTagPopoverOpen(true)}
                  className="gap-2 cursor-pointer hover:bg-white/5 text-xs"
                >
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  Edit Tags
                </DropdownMenuItem>

                {/* Expiry */}
                {EXPIRY_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => handleSetExpiry(opt.value)}
                    className={`gap-2 cursor-pointer hover:bg-white/5 text-xs ${
                      expiry.option === opt.value ? "text-indigo-400" : ""
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {opt.label}
                    {expiry.option === opt.value && " ✓"}
                  </DropdownMenuItem>
                ))}

                {/* Delete */}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => onDelete(clip.id)}
                      disabled={isDeleting}
                      className="gap-2 cursor-pointer hover:bg-red-500/10 text-red-400 text-xs"
                      data-ocid="clip.delete_button"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "✕"
                      )}{" "}
                      Delete Clip
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Social share pills */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg px-2 py-1 transition-all"
              title="Copy share link"
              data-ocid="clip.button"
            >
              <Copy className="w-3 h-3" />
              Share
            </button>
            <button
              type="button"
              onClick={handleShareToX}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg px-2 py-1 transition-all"
              title="Share to X/Twitter"
            >
              <SiX className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleShareToDiscord}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-indigo-400 bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg px-2 py-1 transition-all"
              title="Copy for Discord"
            >
              <Share2 className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleShareToReddit}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-orange-400 bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg px-2 py-1 transition-all"
              title="Share to Reddit"
            >
              <SiReddit className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Tag editor popover (rendered as Dialog-like overlay) */}
      {tagPopoverOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setTagPopoverOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setTagPopoverOpen(false)}
        >
          <div
            className="bg-[#0B0E14] border border-white/10 rounded-xl p-4 w-56 space-y-3"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            data-ocid="clip.popover"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-400" />
              <h4 className="text-white font-semibold text-sm">Edit Tags</h4>
            </div>
            <div className="space-y-1.5">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleToggleTag(cat)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-all flex items-center justify-between ${
                    tags.includes(cat)
                      ? CATEGORY_COLORS[cat]
                      : "bg-white/3 border-white/8 text-muted-foreground hover:bg-white/8"
                  }`}
                >
                  {cat}
                  {tags.includes(cat) && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTagPopoverOpen(false)}
              className="w-full text-xs text-center text-muted-foreground hover:text-white py-1 transition-colors"
              data-ocid="clip.close_button"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      <CommentsModal
        clipId={clip.id}
        clipTitle={clip.title}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        onCommentAdded={() => setCommentCount((c) => c + 1)}
      />
    </>
  );
}

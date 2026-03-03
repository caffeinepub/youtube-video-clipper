import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Send } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type ClipComment,
  addComment,
  getComments,
} from "../hooks/useClipExtras";
import { useGetCallerUserProfile } from "../hooks/useQueries";

interface CommentsModalProps {
  clipId: string;
  clipTitle: string;
  open: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export default function CommentsModal({
  clipId,
  clipTitle,
  open,
  onClose,
  onCommentAdded,
}: CommentsModalProps) {
  const [comments, setComments] = useState<ClipComment[]>([]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { data: userProfile } = useGetCallerUserProfile();

  useEffect(() => {
    if (open) {
      setComments(getComments(clipId));
    }
  }, [open, clipId]);

  const handleSubmit = async () => {
    if (!body.trim()) return;
    if (body.trim().length > 500) {
      toast.error("Comment is too long (max 500 characters)");
      return;
    }

    setSubmitting(true);
    try {
      const authorName = userProfile?.name || "Anonymous";
      const comment = addComment(clipId, authorName, body.trim());
      setComments((prev) => [...prev, comment]);
      setBody("");
      onCommentAdded?.();
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-[#0B0E14] border border-white/10 text-white max-w-lg w-full"
        data-ocid="comments.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white font-display">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Comments
          </DialogTitle>
          <p className="text-muted-foreground text-xs line-clamp-1 mt-1">
            on "{clipTitle}"
          </p>
        </DialogHeader>

        {/* Comments list */}
        <ScrollArea className="max-h-64 pr-1">
          {comments.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-10 text-center"
              data-ocid="comments.empty_state"
            >
              <MessageSquare className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground text-sm">No comments yet</p>
              <p className="text-muted-foreground/50 text-xs mt-1">
                Be the first to comment!
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-2">
              {comments.map((comment, idx) => (
                <div
                  key={comment.id}
                  className="flex gap-3 p-2.5 rounded-xl bg-white/3 border border-white/8"
                  data-ocid={`comments.item.${idx + 1}`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0 ring-1 ring-indigo-500/30">
                    <AvatarFallback className="bg-indigo-600/50 text-white text-xs font-semibold">
                      {comment.authorName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-xs font-semibold">
                        {comment.authorName}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-foreground/90 text-sm leading-relaxed break-words">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Add comment */}
        <div className="border-t border-white/8 pt-4 space-y-3">
          <Textarea
            placeholder="Write a comment… (Ctrl+Enter to submit)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            maxLength={500}
            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-indigo-500/60 resize-none text-sm"
            data-ocid="comments.textarea"
          />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">
              {body.length}/500
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-white text-xs"
                data-ocid="comments.cancel_button"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={submitting || !body.trim()}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs gap-1.5"
                data-ocid="comments.submit_button"
              >
                {submitting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
                Comment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

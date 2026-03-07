import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag, Loader2, Plus, Search, Trash2, Users, Zap } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { CollabListing } from "../backend";
import ReportUserModal from "../components/ReportUserModal";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shortPrincipal(p: Principal): string {
  const s = p.toString();
  if (s.length <= 12) return s;
  return `${s.slice(0, 8)}...${s.slice(-4)}`;
}

function timeAgo(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

// Niche → accent color pairs
const NICHE_COLORS: Record<string, string> = {
  gaming: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  tech: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  vlog: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  music: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  sports: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  cooking: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  education: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

function getNicheColor(niche: string): string {
  const key = niche.toLowerCase();
  for (const [k, v] of Object.entries(NICHE_COLORS)) {
    if (key.includes(k)) return v;
  }
  return "bg-primary/20 text-primary border-primary/30";
}

// ─── Post Listing Modal ───────────────────────────────────────────────────────

interface PostListingModalProps {
  open: boolean;
  onClose: () => void;
}

function PostListingModal({ open, onClose }: PostListingModalProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [niche, setNiche] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const postMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      if (!niche.trim()) throw new Error("Niche is required");
      if (!description.trim()) throw new Error("Description is required");
      if (!contactInfo.trim()) throw new Error("Contact info is required");
      await actor.postCollabListing(
        niche.trim(),
        description.trim(),
        contactInfo.trim(),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collabListings"] });
      toast.success("Collab listing posted!");
      setNiche("");
      setDescription("");
      setContactInfo("");
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to post listing.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postMutation.mutate();
  };

  const handleClose = () => {
    if (postMutation.isPending) return;
    setNiche("");
    setDescription("");
    setContactInfo("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-[#0D1117] border border-primary/20 text-white max-w-md"
        data-ocid="collab.post.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center neon-glow-sm">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-white font-bold text-lg font-display">
              Post a Collab Listing
            </DialogTitle>
          </div>
          <p className="text-muted-foreground text-sm">
            Let other creators find you. Be clear about what you're looking for.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="collab-niche"
              className="text-xs text-muted-foreground"
            >
              Niche <span className="text-primary">*</span>
            </Label>
            <Input
              id="collab-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Gaming, Tech, Vlog…"
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary/50 h-9 text-sm"
              maxLength={50}
              required
              data-ocid="collab.post.niche_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="collab-description"
              className="text-xs text-muted-foreground"
            >
              Description <span className="text-primary">*</span>
            </Label>
            <Textarea
              id="collab-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kind of collab are you looking for? What's your content about?"
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary/50 resize-none min-h-[90px] text-sm"
              maxLength={500}
              required
              data-ocid="collab.post.textarea"
            />
            <p className="text-muted-foreground/40 text-xs text-right">
              {description.length}/500
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="collab-contact"
              className="text-xs text-muted-foreground"
            >
              Contact Info <span className="text-primary">*</span>
            </Label>
            <Input
              id="collab-contact"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="e.g. Discord: BeastCreator#1234, @twitter, email…"
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary/50 h-9 text-sm"
              maxLength={100}
              required
              data-ocid="collab.post.contact_input"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={postMutation.isPending}
              className="flex-1 h-9 text-sm text-muted-foreground hover:text-white hover:bg-white/5"
              data-ocid="collab.post.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                postMutation.isPending ||
                !niche.trim() ||
                !description.trim() ||
                !contactInfo.trim()
              }
              className="flex-1 h-9 text-sm bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 disabled:opacity-40 neon-glow-sm"
              data-ocid="collab.post.submit_button"
            >
              {postMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  Posting…
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 mr-2" />
                  Post Listing
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

interface ListingCardProps {
  listing: CollabListing;
  currentPrincipal: string | null;
  index: number;
  onReport: (principal: Principal) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function ListingCard({
  listing,
  currentPrincipal,
  index,
  onReport,
  onDelete,
  isDeleting,
}: ListingCardProps) {
  const ownerStr = listing.ownerPrincipal.toString();
  const isOwn = currentPrincipal === ownerStr;

  return (
    <div
      className="glass-card p-4 flex flex-col gap-3 relative group"
      data-ocid={`collab.item.${index + 1}`}
    >
      {/* Niche pill + timestamp */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getNicheColor(listing.niche)}`}
        >
          {listing.niche}
        </span>
        <span className="text-muted-foreground text-xs">
          {timeAgo(listing.createdAt)}
        </span>
      </div>

      {/* Description */}
      <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
        {listing.description}
      </p>

      {/* Contact info */}
      <div className="flex items-start gap-2">
        <span className="text-muted-foreground text-xs mt-0.5">Contact:</span>
        <span className="text-primary text-xs font-medium break-all">
          {listing.contactInfo}
        </span>
      </div>

      {/* Principal */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-[10px]">Posted by</span>
        <code className="text-muted-foreground/70 text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/8">
          {shortPrincipal(listing.ownerPrincipal)}
        </code>
        {isOwn && (
          <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">
            You
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
        {!isOwn && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onReport(listing.ownerPrincipal)}
            className="h-7 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 gap-1.5 px-2"
            data-ocid={`collab.report.button.${index + 1}`}
          >
            <Flag className="w-3 h-3" />
            Report
          </Button>
        )}

        {isOwn && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(listing.id)}
            disabled={isDeleting}
            className="h-7 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 gap-1.5 px-2 ml-auto"
            data-ocid={`collab.delete_button.${index + 1}`}
          >
            {isDeleting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CollabFinderPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [reportPrincipal, setReportPrincipal] = useState<Principal | null>(
    null,
  );
  const [search, setSearch] = useState("");

  const currentPrincipal = identity?.getPrincipal().toString() ?? null;

  const { data: listings = [], isLoading } = useQuery<CollabListing[]>({
    queryKey: ["collabListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCollabListings();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteCollabListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collabListings"] });
      toast.success("Listing removed.");
    },
    onError: () => {
      toast.error("Failed to delete listing.");
    },
  });

  // Filter by search
  const filtered = listings.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.niche.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.contactInfo.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-foreground font-bold text-2xl font-display">
              Collab Finder
            </h1>
            <p className="text-muted-foreground text-sm">
              Connect with creators and grow together
            </p>
          </div>
        </div>
        <Button
          onClick={() => setPostModalOpen(true)}
          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 h-9 text-sm neon-glow-sm gap-1.5"
          data-ocid="collab.post.open_modal_button"
        >
          <Plus className="w-4 h-4" />
          Post a Listing
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by niche, description, or contact…"
          className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary/40 h-10"
          data-ocid="collab.search_input"
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          <span className="text-primary font-semibold">{listings.length}</span>{" "}
          listing{listings.length !== 1 ? "s" : ""}
        </span>
        {search && (
          <span>
            — <span className="text-white font-medium">{filtered.length}</span>{" "}
            match{filtered.length !== 1 ? "es" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <div
              key={k}
              className="glass-card p-4 h-48 animate-pulse"
              data-ocid="collab.loading_state"
            >
              <div className="h-4 w-24 bg-white/8 rounded-full mb-3" />
              <div className="h-3 w-full bg-white/5 rounded mb-2" />
              <div className="h-3 w-4/5 bg-white/5 rounded mb-2" />
              <div className="h-3 w-3/5 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="glass-card flex flex-col items-center justify-center py-16 text-center"
          data-ocid="collab.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 neon-glow-sm">
            <Users className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">
            {search
              ? "No listings match your search"
              : "No collab listings yet"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            {search
              ? "Try a different keyword or niche."
              : "Be the first to post a listing and find your next collaborator."}
          </p>
          {!search && (
            <Button
              onClick={() => setPostModalOpen(true)}
              className="mt-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 h-9 text-sm gap-1.5"
              data-ocid="collab.post.open_modal_button"
            >
              <Plus className="w-4 h-4" />
              Post a Listing
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((listing, idx) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              currentPrincipal={currentPrincipal}
              index={idx}
              onReport={(p) => setReportPrincipal(p)}
              onDelete={(id) => deleteMutation.mutate(id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Post Listing Modal */}
      <PostListingModal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
      />

      {/* Report User Modal */}
      {reportPrincipal && (
        <ReportUserModal
          open={!!reportPrincipal}
          onClose={() => setReportPrincipal(null)}
          reportedPrincipal={reportPrincipal}
        />
      )}
    </div>
  );
}

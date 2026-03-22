import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Check,
  Coins,
  Copy,
  Loader2,
  Pencil,
  Scissors,
  ShieldCheck,
  User,
  Youtube,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type { MintedClip } from "../backend";
import SecuritySettings from "../components/SecuritySettings";
import UserRoleBadge from "../components/UserRoleBadge";
import { useActor } from "../hooks/useActor";
import { useClips } from "../hooks/useClips";
import { useGetOwnRole } from "../hooks/useGetOwnRole";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeAgo(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: ownRole } = useGetOwnRole();
  const { data: clips = [] } = useClips();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const [copiedPrincipal, setPrincipalCopied] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameSaved, setNicknameSaved] = useState(false);

  const principal = identity?.getPrincipal().toString() ?? "";
  const [activeTab, setActiveTab] = useState<"overview" | "security">(
    "overview",
  );

  // Sync input with loaded profile — only set on first load when input is empty
  useEffect(() => {
    if (userProfile?.name && !nicknameInput) {
      setNicknameInput(userProfile.name);
    }
  }, [userProfile?.name, nicknameInput]);

  const { data: mintedClips = [] } = useQuery<MintedClip[]>({
    queryKey: ["mintedClips"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMintedClips();
    },
    enabled: !!actor && !actorFetching,
  });

  const saveNicknameMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      if (!userProfile) throw new Error("Profile not loaded");
      await actor.saveCallerUserProfile({ ...userProfile, name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerUserProfile"] });
      toast.success("Nickname saved!");
      setNicknameSaved(true);
      setTimeout(() => setNicknameSaved(false), 2000);
    },
    onError: (err: Error) => {
      toast.error("Failed to save nickname", { description: err.message });
    },
  });

  const roleStr = ownRole
    ? typeof ownRole === "object"
      ? Object.keys(ownRole)[0]
      : String(ownRole)
    : "user";

  const userName = userProfile?.name || "User";
  const userInitials = userName.slice(0, 2).toUpperCase();

  let profilePicUrl: string | undefined;
  if (userProfile?.profilePicture) {
    profilePicUrl = userProfile.profilePicture.getDirectURL();
  }

  const handleCopyPrincipal = async () => {
    try {
      await navigator.clipboard.writeText(principal);
      setPrincipalCopied(true);
      toast.success("Principal ID copied!");
      setTimeout(() => setPrincipalCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const recentClips = [...clips]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-foreground font-bold text-2xl font-display">
            My Profile
          </h1>
          <p className="text-muted-foreground text-sm">Your account overview</p>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(
          [
            { id: "overview", label: "Overview", icon: "👤" },
            { id: "security", label: "Security", icon: "🔒" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-white"
            }`}
            data-ocid={`profile.${tab.id}.tab`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "security" && <SecuritySettings />}

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Profile Card */}
          <div
            className="cyber-card p-6 rounded-2xl space-y-4"
            data-ocid="profile.card"
          >
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-primary/40 neon-glow-sm">
                {profilePicUrl && (
                  <AvatarImage src={profilePicUrl} alt={userName} />
                )}
                <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-white font-bold text-xl">{userName}</h2>
                  {roleStr && (
                    <UserRoleBadge
                      role={roleStr as import("../backend").UserRole}
                    />
                  )}
                  {userProfile?.status && userProfile.status !== "active" && (
                    <Badge
                      className={`text-xs border ${
                        userProfile.status === "banned"
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      }`}
                    >
                      {userProfile.status}
                    </Badge>
                  )}
                </div>

                {/* Principal ID */}
                <div className="flex items-center gap-2">
                  <code className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded font-mono truncate max-w-[240px]">
                    {principal}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyPrincipal}
                    className="h-6 w-6 text-muted-foreground hover:text-primary"
                    data-ocid="profile.button"
                  >
                    {copiedPrincipal ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>

                {/* YouTube Connection */}
                {userProfile?.youtubeAuth && (
                  <div className="flex items-center gap-2 text-sm">
                    <Youtube className="w-4 h-4 text-red-400" />
                    <span className="text-muted-foreground">
                      Connected:{" "}
                      <span className="text-white font-medium">
                        {userProfile.youtubeAuth.channelName}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                <Scissors className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-white font-bold text-lg">{clips.length}</p>
                <p className="text-muted-foreground text-xs">Clips</p>
              </div>
              <div className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                <Coins className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                <p className="text-white font-bold text-lg">
                  {mintedClips.length}
                </p>
                <p className="text-muted-foreground text-xs">Minted</p>
              </div>
              <div className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                <Activity className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <p className="text-white font-bold text-lg">
                  {recentClips.length > 0 ? "Active" : "New"}
                </p>
                <p className="text-muted-foreground text-xs">Status</p>
              </div>
            </div>
          </div>

          {/* Nickname Editor */}
          <div className="glass-card p-5 space-y-3" data-ocid="profile.section">
            <div className="flex items-center gap-2 mb-1">
              <Pencil className="w-4 h-4 text-primary" />
              <h3 className="text-white font-semibold text-sm">
                Display Nickname
              </h3>
            </div>
            <p className="text-muted-foreground text-xs">
              Set how your name appears across Beast Clipping. This updates the
              greeting in the sidebar instantly.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nickname</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder="Enter your display name…"
                  maxLength={32}
                  className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 text-sm"
                  data-ocid="profile.input"
                />
                <Button
                  size="sm"
                  onClick={() =>
                    saveNicknameMutation.mutate(nicknameInput.trim())
                  }
                  disabled={
                    saveNicknameMutation.isPending ||
                    !nicknameInput.trim() ||
                    nicknameInput.trim() === userProfile?.name
                  }
                  className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 h-9 px-3 flex-shrink-0"
                  data-ocid="profile.save_button"
                >
                  {saveNicknameMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : nicknameSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Saved!
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-4 space-y-3" data-ocid="profile.section">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-white font-semibold text-sm">Recent Clips</h3>
            </div>
            {recentClips.length === 0 ? (
              <div className="text-center py-8" data-ocid="profile.empty_state">
                <Scissors className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No clips yet</p>
                <p className="text-muted-foreground/60 text-xs mt-1">
                  Start creating clips from the Dashboard
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentClips.map((clip, idx) => (
                  <div
                    key={clip.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 border border-white/5 hover:bg-white/5 transition-colors"
                    data-ocid={`profile.item.${idx + 1}`}
                  >
                    {clip.thumbnailUrl ? (
                      <img
                        src={clip.thumbnailUrl}
                        alt={clip.title}
                        className="w-10 h-7 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-7 bg-white/5 rounded flex items-center justify-center">
                        <Scissors className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">
                        {clip.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatTimeAgo(clip.createdAt)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {Number(clip.endTime) - Number(clip.startTime)}s
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Minted NFT Gallery */}
          {mintedClips.length > 0 && (
            <div
              className="glass-card p-4 space-y-3"
              data-ocid="profile.section"
            >
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-4 h-4 text-yellow-400" />
                <h3 className="text-white font-semibold text-sm">
                  ICP Minted Gallery
                </h3>
                <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs px-2 py-0.5 rounded-full">
                  {mintedClips.length} NFT{mintedClips.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-2">
                {mintedClips.map((clip, idx) => (
                  <div
                    key={clip.clipId}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/15"
                    data-ocid={`profile.item.${idx + 1}`}
                  >
                    <Coins className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">
                        {clip.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Minted {formatDate(clip.mintedAt)}
                      </p>
                    </div>
                    <span className="text-xs text-yellow-400 font-medium">
                      ◎ ICP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground/50 pb-4 flex items-center justify-center gap-1">
        Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}

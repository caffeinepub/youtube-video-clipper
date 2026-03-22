import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  DollarSign,
  ExternalLink,
  Eye,
  Flag,
  Heart,
  Link2,
  Loader2,
  Lock,
  MessageSquare,
  Plus,
  Settings,
  Shield,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AdminLink, CreatorReport } from "../backend";
import { NotificationType, UserStatus } from "../backend";
import { useActor } from "../hooks/useActor";
import { useGetOwnRole } from "../hooks/useGetOwnRole";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsOwner } from "../hooks/useIsOwner";
import ActivityLogTable from "./ActivityLogTable";
import AdminAdvancedTabs from "./AdminAdvancedTabs";
import AdminErrorBoundary from "./AdminErrorBoundary";
import AdminManagement from "./AdminManagement";
import AdminMegaTabs from "./AdminMegaTabs";
import { AdminMessaging } from "./AdminMessaging";
import AppAnalytics from "./AppAnalytics";
import { getPayPalUrl, setPayPalUrl } from "./DonateButton";
import FeedbackSubmissions from "./FeedbackSubmissions";
import { SystemControls } from "./SystemControls";
import UserStatusManagement from "./UserStatusManagement";
import WarningsManager from "./WarningsManager";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
  badge,
}: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            {icon}
          </div>
          <span className="text-white font-semibold text-sm">{title}</span>
          {badge && (
            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/30">
              {badge}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="border-t border-white/8 p-4">{children}</div>}
    </div>
  );
}

function DonateSettings() {
  const [paypalUrl, setPaypalUrl] = useState(() => getPayPalUrl());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setPayPalUrl(paypalUrl.trim());
    setSaved(true);
    toast.success("PayPal donation link saved!");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setPaypalUrl("");
    setPayPalUrl("");
    toast.success("Donation link removed");
  };

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-xs leading-relaxed">
        Set your PayPal donation link. Leave empty to hide the Donate button
        from all users. Only the owner can change this setting.
      </p>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">PayPal URL</Label>
        <Input
          placeholder="https://paypal.me/yourusername"
          value={paypalUrl}
          onChange={(e) => setPaypalUrl(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-pink-500/50 h-8 text-sm mt-1"
          data-ocid="admin.donate.input"
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          className="flex-1 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/30 h-8 text-xs"
          data-ocid="admin.donate.save_button"
        >
          <Heart className="w-3 h-3 mr-1.5" />
          {saved ? "Saved!" : "Save Donation Link"}
        </Button>
        {paypalUrl && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClear}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 text-xs px-2"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ShutdownMessageEditor() {
  const [message, setMessage] = useState(
    () =>
      localStorage.getItem("beast_shutdown_message") ||
      "Beast Clipping is currently down. Please wait for it to come back online.",
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      toast.error("Message cannot be empty");
      return;
    }
    localStorage.setItem("beast_shutdown_message", trimmed);
    setSaved(true);
    toast.success("Shutdown message updated!");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaultMsg =
      "Beast Clipping is currently down. Please wait for it to come back online.";
    setMessage(defaultMsg);
    localStorage.setItem("beast_shutdown_message", defaultMsg);
    toast.success("Reset to default message");
  };

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-xs leading-relaxed">
        Customize the message shown to non-admin users when the app is paused.
        Admins and owners can always access the app.
      </p>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Shutdown Message
        </Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-orange-500/50 text-sm resize-none min-h-[80px] mt-1"
          data-ocid="admin.shutdown.textarea"
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 h-8 text-xs"
          data-ocid="admin.shutdown.save_button"
        >
          <MessageSquare className="w-3 h-3 mr-1.5" />
          {saved ? "Saved!" : "Save Message"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          className="text-muted-foreground hover:text-white hover:bg-white/5 h-8 text-xs px-2"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

function AdminLinksManager() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const { data: links = [], isLoading } = useQuery<AdminLink[]>({
    queryKey: ["adminLinks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminLinks();
    },
    enabled: !!actor && !actorFetching,
  });

  const addMutation = useMutation({
    mutationFn: async ({ title, url }: { title: string; url: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addAdminLink(title, url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLinks"] });
      setNewTitle("");
      setNewUrl("");
      toast.success("Link added!");
    },
    onError: () => toast.error("Failed to add link"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteAdminLink(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLinks"] });
      toast.success("Link removed");
    },
    onError: () => toast.error("Failed to remove link"),
  });

  const handleAdd = () => {
    if (!newTitle.trim() || !newUrl.trim()) {
      toast.error("Title and URL are required");
      return;
    }
    let url = newUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    addMutation.mutate({ title: newTitle.trim(), url });
  };

  return (
    <div className="space-y-4">
      {/* Add Link Form */}
      <div className="glass-card p-3 space-y-3">
        <h4 className="text-white font-medium text-sm flex items-center gap-2">
          <Plus className="w-3.5 h-3.5 text-primary" />
          Add New Link
        </h4>
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              placeholder="e.g. Discord Server"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary/50 h-8 text-sm mt-1"
              data-ocid="admin.links.input"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">URL</Label>
            <Input
              placeholder="https://..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary/50 h-8 text-sm mt-1"
              data-ocid="admin.links.input"
            />
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={addMutation.isPending}
            className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 h-8 text-xs"
            data-ocid="admin.links.submit_button"
          >
            {addMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
            ) : (
              <Plus className="w-3 h-3 mr-1.5" />
            )}
            Add Link
          </Button>
        </div>
      </div>

      {/* Existing Links */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : links.length === 0 ? (
          <div
            className="text-center py-6 text-muted-foreground text-sm"
            data-ocid="admin.links.empty_state"
          >
            No links yet. Add one above.
          </div>
        ) : (
          links.map((link, idx) => (
            <div
              key={String(link.id)}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/8"
              data-ocid={`admin.links.item.${idx + 1}`}
            >
              <Link2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  {link.title}
                </p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/60 text-xs hover:text-primary flex items-center gap-1 truncate"
                >
                  <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                  {link.url}
                </a>
              </div>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(link.id)}
                disabled={deleteMutation.isPending}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                data-ocid="admin.links.delete_button"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Creator Reports ──────────────────────────────────────────────────────────

function shortPrincipal(p: string): string {
  if (p.length <= 12) return p;
  return `${p.slice(0, 8)}...${p.slice(-4)}`;
}

function timeAgoMs(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function CreatorReports() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const senderPrincipal = identity?.getPrincipal() ?? null;

  const { data: reports = [], isLoading } = useQuery<CreatorReport[]>({
    queryKey: ["creatorReports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCreatorReports();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30_000,
  });

  const resolveMutation = useMutation({
    mutationFn: async (reportId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.resolveCreatorReport(reportId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creatorReports"] });
      toast.success("Report marked as resolved.");
    },
    onError: () => toast.error("Failed to resolve report."),
  });

  const warnMutation = useMutation({
    mutationFn: async ({ report }: { report: CreatorReport }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addNotification(
        report.reportedPrincipal,
        `⚠️ Warning: Reported for ${report.reason}`,
        NotificationType.system_announcement,
        senderPrincipal,
      );
    },
    onSuccess: () => toast.success("Warning sent to user."),
    onError: () => toast.error("Failed to send warning."),
  });

  const banMutation = useMutation({
    mutationFn: async (report: CreatorReport) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateUserStatus(report.reportedPrincipal, UserStatus.banned);
    },
    onSuccess: () => toast.success("User banned."),
    onError: () => toast.error("Failed to ban user."),
  });

  const suspendMutation = useMutation({
    mutationFn: async (report: CreatorReport) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateUserStatus(
        report.reportedPrincipal,
        UserStatus.suspended,
      );
    },
    onSuccess: () => toast.success("User suspended for 1 day."),
    onError: () => toast.error("Failed to suspend user."),
  });

  if (isLoading) {
    return (
      <div
        className="flex justify-center py-8"
        data-ocid="admin.reports.loading_state"
      >
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div
        className="text-center py-10 text-muted-foreground text-sm"
        data-ocid="admin.reports.empty_state"
      >
        <Flag className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
        No creator reports yet.
      </div>
    );
  }

  const pending = reports.filter((r) => !r.resolved);
  const resolved = reports.filter((r) => r.resolved);
  const sorted = [...pending, ...resolved];

  return (
    <div className="overflow-x-auto" data-ocid="admin.reports.table">
      <Table>
        <TableHeader>
          <TableRow className="border-white/8 hover:bg-transparent">
            <TableHead className="text-muted-foreground text-xs font-medium">
              Reporter
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-medium">
              Reported
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-medium">
              Reason
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-medium hidden md:table-cell">
              Details
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-medium hidden sm:table-cell">
              Time
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-medium">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((report, idx) => (
            <TableRow
              key={report.id}
              className="border-white/5 hover:bg-white/3"
              data-ocid={`admin.reports.row.${idx + 1}`}
            >
              <TableCell className="py-3">
                <code className="text-[10px] font-mono text-muted-foreground/70 bg-white/5 px-1.5 py-0.5 rounded">
                  {shortPrincipal(report.reporterPrincipal.toString())}
                </code>
              </TableCell>
              <TableCell className="py-3">
                <code className="text-[10px] font-mono text-red-400/80 bg-red-500/5 px-1.5 py-0.5 rounded">
                  {shortPrincipal(report.reportedPrincipal.toString())}
                </code>
              </TableCell>
              <TableCell className="py-3">
                <span className="text-xs text-white bg-white/5 border border-white/8 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {report.reason}
                </span>
              </TableCell>
              <TableCell className="py-3 hidden md:table-cell max-w-[160px]">
                <p
                  className="text-xs text-muted-foreground truncate"
                  title={report.description}
                >
                  {report.description || "—"}
                </p>
              </TableCell>
              <TableCell className="py-3 hidden sm:table-cell">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {timeAgoMs(report.timestamp)}
                </span>
              </TableCell>
              <TableCell className="py-3">
                {report.resolved ? (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3" />
                    Resolved
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-400 text-xs whitespace-nowrap">
                    <AlertTriangle className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </TableCell>
              <TableCell className="py-3">
                <div className="flex items-center gap-1 flex-wrap">
                  {/* Warn */}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={report.resolved || warnMutation.isPending}
                    onClick={() => warnMutation.mutate({ report })}
                    className="h-6 text-[10px] px-1.5 text-yellow-400/70 hover:text-yellow-400 hover:bg-yellow-500/10 disabled:opacity-30"
                    data-ocid={`admin.reports.secondary_button.${idx + 1}`}
                    title="Send warning to user"
                  >
                    {warnMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Warn"
                    )}
                  </Button>
                  {/* Ban */}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={report.resolved || banMutation.isPending}
                    onClick={() => banMutation.mutate(report)}
                    className="h-6 text-[10px] px-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                    data-ocid={`admin.reports.delete_button.${idx + 1}`}
                    title="Ban this user"
                  >
                    {banMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Ban"
                    )}
                  </Button>
                  {/* 1-day Suspend */}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={report.resolved || suspendMutation.isPending}
                    onClick={() => suspendMutation.mutate(report)}
                    className="h-6 text-[10px] px-1.5 text-orange-400/70 hover:text-orange-400 hover:bg-orange-500/10 disabled:opacity-30"
                    data-ocid={`admin.reports.secondary_button.${idx + 1}`}
                    title="Suspend user for 1 day"
                  >
                    {suspendMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Suspend"
                    )}
                  </Button>
                  {/* Resolve */}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={report.resolved || resolveMutation.isPending}
                    onClick={() => resolveMutation.mutate(report.id)}
                    className="h-6 text-[10px] px-1.5 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-30"
                    data-ocid={`admin.reports.confirm_button.${idx + 1}`}
                  >
                    {resolveMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Resolve"
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Content Moderation ──────────────────────────────────────────────────────

function ContentModerationSection() {
  const [shadowBanPrincipal, setShadowBanPrincipal] = useState("");
  const mockFlags = [
    {
      id: "clip_001",
      type: "Copyright",
      reporter: "user_a8f2",
      status: "Pending",
    },
    { id: "clip_002", type: "NSFW", reporter: "user_b3c9", status: "Pending" },
    {
      id: "clip_003",
      type: "Violence",
      reporter: "auto_ai",
      status: "Under Review",
    },
    {
      id: "clip_004",
      type: "Copyright",
      reporter: "user_d7e1",
      status: "Resolved",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Flagged queue */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/8">
              <TableHead className="text-xs text-muted-foreground">
                Video ID
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="text-xs text-muted-foreground hidden sm:table-cell">
                Reporter
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFlags.map((f, i) => (
              <TableRow
                key={f.id}
                className="border-white/5"
                data-ocid={`admin.moderation.row.${i + 1}`}
              >
                <TableCell className="py-2 font-mono text-xs text-primary">
                  {f.id}
                </TableCell>
                <TableCell className="py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${f.type === "Copyright" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : f.type === "NSFW" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}
                  >
                    {f.type}
                  </span>
                </TableCell>
                <TableCell className="py-2 hidden sm:table-cell text-xs text-muted-foreground">
                  {f.reporter}
                </TableCell>
                <TableCell className="py-2">
                  <span
                    className={`text-xs ${f.status === "Resolved" ? "text-emerald-400" : f.status === "Under Review" ? "text-blue-400" : "text-yellow-400"}`}
                  >
                    {f.status}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] px-1.5 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10"
                      data-ocid={`admin.moderation.confirm_button.${i + 1}`}
                    >
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] px-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                      data-ocid={`admin.moderation.delete_button.${i + 1}`}
                    >
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] px-1.5 text-muted-foreground hover:text-white hover:bg-white/5"
                      data-ocid={`admin.moderation.secondary_button.${i + 1}`}
                    >
                      Dismiss
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Batch actions */}
      <div className="flex items-center gap-3 glass-card p-3">
        <span className="text-xs text-muted-foreground">Batch Actions:</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
          data-ocid="admin.moderation.delete_button"
        >
          Delete All From User
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-muted-foreground hover:text-white hover:bg-white/5"
          data-ocid="admin.moderation.button"
        >
          Clear All Flags
        </Button>
      </div>

      {/* Shadow ban */}
      <div className="glass-card p-3 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">
          Shadow-Ban / Restrict User
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Principal ID"
            value={shadowBanPrincipal}
            onChange={(e) => setShadowBanPrincipal(e.target.value)}
            className="bg-white/5 border-white/10 text-white h-8 text-xs flex-1"
            data-ocid="admin.moderation.input"
          />
          <Button
            size="sm"
            onClick={() => {
              toast.success(`Shadow-banned: ${shadowBanPrincipal}`);
              setShadowBanPrincipal("");
            }}
            disabled={!shadowBanPrincipal.trim()}
            className="h-8 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
            data-ocid="admin.moderation.submit_button"
          >
            Shadow-Ban
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Infrastructure Monitor ───────────────────────────────────────────────────

function InfrastructureSection() {
  return (
    <div className="space-y-4">
      {/* Worker nodes */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium">
          Worker Nodes
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "Node 1", status: "Online", color: "emerald" },
            { name: "Node 2", status: "Online", color: "emerald" },
            { name: "Node 3", status: "Idle", color: "yellow" },
          ].map((node, i) => (
            <div
              key={node.name}
              className="glass-card p-3 text-center"
              data-ocid={`admin.infra.card.${i + 1}`}
            >
              <div
                className={`w-2 h-2 rounded-full mx-auto mb-1 ${node.color === "emerald" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-yellow-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"}`}
              />
              <p className="text-white text-xs font-medium">{node.name}</p>
              <p
                className={`text-[10px] ${node.color === "emerald" ? "text-emerald-400" : "text-yellow-400"}`}
              >
                {node.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Queue depth */}
      <div className="glass-card p-3 space-y-1">
        <p className="text-xs text-muted-foreground font-medium">Queue Depth</p>
        <p className="text-white text-sm">
          12 videos pending{" "}
          <span className="text-muted-foreground text-xs">
            · avg wait 2m 14s
          </span>
        </p>
      </div>

      {/* Storage */}
      <div className="glass-card p-3 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">
          Storage Usage
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-white">Used</span>
            <span className="text-muted-foreground">2.4 TB / 10 TB</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/70 rounded-full"
              style={{ width: "24%" }}
            />
          </div>
        </div>
      </div>

      {/* Error logs */}
      <div className="glass-card p-3 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">
          Recent Error Logs
        </p>
        <div className="space-y-1.5">
          {[
            {
              time: "14:22:01",
              type: "Encoding Error",
              detail: "video_id=xK92B: FFmpeg timeout",
            },
            {
              time: "13:57:44",
              type: "Source 404",
              detail: "video_id=pL31F: URL not found",
            },
            {
              time: "12:44:09",
              type: "Encoding Error",
              detail: "video_id=qR88C: Unsupported codec",
            },
          ].map((log, i) => (
            <div
              key={log.time}
              className="flex items-start gap-2 text-xs py-1 border-b border-white/5 last:border-0"
              data-ocid={`admin.infra.row.${i + 1}`}
            >
              <span className="text-muted-foreground font-mono flex-shrink-0">
                {log.time}
              </span>
              <span className="text-red-400 flex-shrink-0">{log.type}</span>
              <span className="text-muted-foreground/70 truncate">
                {log.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Growth Analytics ─────────────────────────────────────────────────────────

function GrowthAnalyticsSection() {
  const [activeSessions, setActiveSessions] = useState(
    () => Math.floor(Math.random() * 75) + 45,
  );

  useEffect(() => {
    const t = setInterval(() => {
      setActiveSessions((n) =>
        Math.max(30, n + Math.floor(Math.random() * 5) - 2),
      );
    }, 10000);
    return () => clearInterval(t);
  }, []);

  const trending = [
    { name: "Fortnite — xQc", clips: 412 },
    { name: "Minecraft — Dream", clips: 389 },
    { name: "Valorant — TenZ", clips: 274 },
    { name: "Warzone — TimTheTatman", clips: 201 },
    { name: "Apex — Hal", clips: 183 },
  ];

  const exports = [
    { platform: "YouTube Shorts", count: 234, color: "red" },
    { platform: "TikTok", count: 89, color: "pink" },
    { platform: "Downloads", count: 412, color: "primary" },
  ];

  const funnel = [
    { label: "Sign-up", pct: 100 },
    { label: "First Clip", pct: 64 },
    { label: "Shared Clip", pct: 31 },
  ];

  return (
    <div className="space-y-4">
      {/* Active sessions */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div>
          <p className="text-muted-foreground text-xs">Active Sessions</p>
          <p className="text-primary text-3xl font-bold font-mono">
            {activeSessions}
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Live
          </span>
        </div>
      </div>

      {/* Trending content */}
      <div className="glass-card p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Trending Content
        </p>
        {trending.map((t, i) => (
          <div
            key={t.name}
            className="flex items-center justify-between text-xs"
            data-ocid={`admin.analytics.row.${i + 1}`}
          >
            <span className="text-white">{t.name}</span>
            <span className="text-primary font-mono">{t.clips} clips</span>
          </div>
        ))}
      </div>

      {/* Export stats */}
      <div className="glass-card p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Export Stats
        </p>
        {exports.map((e) => (
          <div
            key={e.platform}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-white">{e.platform}</span>
            <span
              className={`font-mono ${e.color === "red" ? "text-red-400" : e.color === "pink" ? "text-pink-400" : "text-primary"}`}
            >
              {e.count}
            </span>
          </div>
        ))}
      </div>

      {/* Retention funnel */}
      <div className="glass-card p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Retention Funnel
        </p>
        {funnel.map((f) => (
          <div key={f.label} className="space-y-0.5">
            <div className="flex justify-between text-xs">
              <span className="text-white">{f.label}</span>
              <span className="text-primary">{f.pct}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/60 rounded-full"
                style={{ width: `${f.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Monetization ─────────────────────────────────────────────────────────────

function MonetizationSection() {
  const tiers = [
    { name: "Free", users: 1840, revenue: "$0" },
    { name: "Pro", users: 312, revenue: "$4,680" },
    { name: "Premium", users: 94, revenue: "$3,760" },
  ];

  const payouts = [
    { creator: "xClipMaster", amount: "$48.50", status: "Pending" },
    { creator: "GamingKing99", amount: "$22.10", status: "Pending" },
    { creator: "ViralShotz", amount: "$91.75", status: "Approved" },
  ];

  return (
    <div className="space-y-4">
      {/* Subscription tiers */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/8">
              <TableHead className="text-xs text-muted-foreground">
                Tier
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Users
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Revenue
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers.map((t, i) => (
              <TableRow
                key={t.name}
                className="border-white/5"
                data-ocid={`admin.billing.row.${i + 1}`}
              >
                <TableCell className="py-2 text-xs text-white">
                  {t.name}
                </TableCell>
                <TableCell className="py-2 text-xs text-muted-foreground">
                  {t.users}
                </TableCell>
                <TableCell className="py-2 text-xs text-emerald-400">
                  {t.revenue}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Ad inventory */}
      <div className="glass-card p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Ad Inventory
        </p>
        <div className="flex gap-6 text-xs">
          <div>
            <span className="text-muted-foreground">Fill Rate </span>
            <span className="text-white font-mono">78%</span>
          </div>
          <div>
            <span className="text-muted-foreground">CPM </span>
            <span className="text-white font-mono">$2.40</span>
          </div>
        </div>
      </div>

      {/* Payout portal */}
      <div className="glass-card p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Payout Requests
        </p>
        <div className="space-y-2">
          {payouts.map((p, i) => (
            <div
              key={p.creator}
              className="flex items-center justify-between"
              data-ocid={`admin.billing.item.${i + 1}`}
            >
              <div>
                <p className="text-white text-xs">{p.creator}</p>
                <p className="text-emerald-400 text-xs font-mono">{p.amount}</p>
              </div>
              <div className="flex gap-1">
                {p.status === "Pending" ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        toast.success(`Approved payout for ${p.creator}`)
                      }
                      className="h-6 text-[10px] px-1.5 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10"
                      data-ocid={`admin.billing.confirm_button.${i + 1}`}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        toast.info(`Rejected payout for ${p.creator}`)
                      }
                      className="h-6 text-[10px] px-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                      data-ocid={`admin.billing.delete_button.${i + 1}`}
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-emerald-400">Approved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── God Mode ─────────────────────────────────────────────────────────────────

function GodModeSection() {
  const [principalId, setPrincipalId] = useState("");
  const [viewingAs, setViewingAs] = useState<string | null>(null);

  const handleViewAs = () => {
    if (!principalId.trim()) {
      toast.error("Enter a principal ID");
      return;
    }
    setViewingAs(principalId.trim());
    toast.info(`God Mode: Viewing as ${principalId.trim()}`);
  };

  return (
    <div className="space-y-3">
      {viewingAs && (
        <div
          className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2"
          data-ocid="admin.godmode.panel"
        >
          <span className="text-yellow-400 text-xs">
            God Mode: Viewing as{" "}
            <code className="font-mono text-yellow-300">
              {viewingAs.slice(0, 16)}...
            </code>
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setViewingAs(null);
              setPrincipalId("");
            }}
            className="h-6 text-xs text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
            data-ocid="admin.godmode.close_button"
          >
            Exit
          </Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Enter a user's principal ID to simulate their view of the dashboard.
        UI-only preview.
      </p>
      <div className="flex gap-2">
        <Input
          placeholder="Principal ID (e.g. 2vxsx-fae...)"
          value={principalId}
          onChange={(e) => setPrincipalId(e.target.value)}
          className="bg-white/5 border-white/10 text-white h-8 text-xs flex-1"
          data-ocid="admin.godmode.input"
        />
        <Button
          size="sm"
          onClick={handleViewAs}
          disabled={!principalId.trim()}
          className="h-8 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
          data-ocid="admin.godmode.primary_button"
        >
          <Eye className="w-3 h-3 mr-1.5" />
          View as User
        </Button>
      </div>
    </div>
  );
}

// ─── Verification ─────────────────────────────────────────────────────────────

function VerificationSection() {
  const [verifications, setVerifications] = useState([
    {
      name: "xClipMaster",
      subs: "125K",
      platform: "YouTube",
      status: "Pending" as const,
    },
    {
      name: "GamingKing99",
      subs: "87K",
      platform: "Twitch",
      status: "Pending" as const,
    },
    {
      name: "ViralShotz",
      subs: "342K",
      platform: "YouTube",
      status: "Verified" as const,
    },
    {
      name: "NoScopePro",
      subs: "22K",
      platform: "Kick",
      status: "Rejected" as const,
    },
  ]);

  const update = (name: string, status: "Verified" | "Rejected") => {
    setVerifications((prev) =>
      prev.map((v) => (v.name === name ? { ...v, status } : v)),
    );
    toast.success(
      `${name} ${status === "Verified" ? "verified" : "rejected"}.`,
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/8">
            <TableHead className="text-xs text-muted-foreground">
              Creator
            </TableHead>
            <TableHead className="text-xs text-muted-foreground hidden sm:table-cell">
              Subs
            </TableHead>
            <TableHead className="text-xs text-muted-foreground hidden md:table-cell">
              Platform
            </TableHead>
            <TableHead className="text-xs text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verifications.map((v, i) => (
            <TableRow
              key={v.name}
              className="border-white/5"
              data-ocid={`admin.verify.row.${i + 1}`}
            >
              <TableCell className="py-2 text-xs text-white">
                {v.name}
              </TableCell>
              <TableCell className="py-2 text-xs text-muted-foreground hidden sm:table-cell">
                {v.subs}
              </TableCell>
              <TableCell className="py-2 text-xs text-muted-foreground hidden md:table-cell">
                {v.platform}
              </TableCell>
              <TableCell className="py-2">
                <span
                  className={`text-xs flex items-center gap-1 ${v.status === "Verified" ? "text-emerald-400" : v.status === "Rejected" ? "text-red-400" : "text-yellow-400"}`}
                >
                  {v.status === "Verified" ? (
                    <BadgeCheck className="w-3 h-3" />
                  ) : v.status === "Rejected" ? (
                    <XCircle className="w-3 h-3" />
                  ) : null}
                  {v.status}
                </span>
              </TableCell>
              <TableCell className="py-2">
                {v.status === "Pending" && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => update(v.name, "Verified")}
                      className="h-6 text-[10px] px-1.5 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10"
                      data-ocid={`admin.verify.confirm_button.${i + 1}`}
                    >
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => update(v.name, "Rejected")}
                      className="h-6 text-[10px] px-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                      data-ocid={`admin.verify.delete_button.${i + 1}`}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdminPanel() {
  const { isOwner } = useIsOwner();
  const { data: ownRole, isLoading: roleLoading } = useGetOwnRole();

  // Normalize role to string
  const roleStr = ownRole
    ? typeof ownRole === "object"
      ? Object.keys(ownRole)[0]
      : String(ownRole)
    : null;

  const isAdmin = roleStr === "admin" || roleStr === "owner" || isOwner;

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-white font-bold text-xl mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          You don't have permission to access the Admin Panel. Contact an
          administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl font-display">
              Admin Panel
            </h1>
            <p className="text-muted-foreground text-xs">
              System management and analytics
            </p>
          </div>
        </div>

        {/* Analytics */}
        <CollapsibleSection
          title="Analytics & Stats"
          icon={<Activity className="w-4 h-4 text-primary" />}
          defaultOpen={true}
          badge="Live"
        >
          <AppAnalytics />
        </CollapsibleSection>

        {/* System Controls */}
        <CollapsibleSection
          title="System Controls"
          icon={<Settings className="w-4 h-4 text-orange-400" />}
        >
          <SystemControls />
        </CollapsibleSection>

        {/* User Management */}
        <CollapsibleSection
          title="User & Clip Management"
          icon={<Users className="w-4 h-4 text-primary" />}
        >
          <UserStatusManagement />
        </CollapsibleSection>

        {/* Activity Logs */}
        <CollapsibleSection
          title="Activity Logs"
          icon={<Activity className="w-4 h-4 text-emerald-400" />}
          badge="Auto-refresh"
        >
          <ActivityLogTable />
        </CollapsibleSection>

        {/* Admin Management */}
        <CollapsibleSection
          title="Admin Management"
          icon={<Shield className="w-4 h-4 text-purple-400" />}
        >
          <AdminManagement />
        </CollapsibleSection>

        {/* Messaging */}
        <CollapsibleSection
          title="Support Messaging"
          icon={<MessageSquare className="w-4 h-4 text-blue-400" />}
        >
          <AdminMessaging />
        </CollapsibleSection>

        {/* Pinned Links Manager */}
        <CollapsibleSection
          title="Pinned Links Manager"
          icon={<Link2 className="w-4 h-4 text-primary" />}
          badge="Public"
        >
          <AdminLinksManager />
        </CollapsibleSection>

        {/* User Warnings */}
        <CollapsibleSection
          title="User Warnings"
          icon={<AlertTriangle className="w-4 h-4 text-yellow-400" />}
        >
          <WarningsManager />
        </CollapsibleSection>

        {/* Shutdown Screen Message — admin + owner */}
        <CollapsibleSection
          title="Shutdown Screen Message"
          icon={<MessageSquare className="w-4 h-4 text-orange-400" />}
        >
          <ShutdownMessageEditor />
        </CollapsibleSection>

        {/* Donate Settings — owner only */}
        {(roleStr === "owner" || isOwner) && (
          <CollapsibleSection
            title="Donate Settings"
            icon={<Heart className="w-4 h-4 text-pink-400" />}
          >
            <DonateSettings />
          </CollapsibleSection>
        )}

        {/* Creator Reports */}
        <CollapsibleSection
          title="Creator Reports"
          icon={<Flag className="w-4 h-4 text-red-400" />}
        >
          <CreatorReports />
        </CollapsibleSection>

        {/* Feedback */}
        <CollapsibleSection
          title="Feedback Submissions"
          icon={<MessageSquare className="w-4 h-4 text-pink-400" />}
        >
          <FeedbackSubmissions />
        </CollapsibleSection>

        {/* Content Moderation */}
        <CollapsibleSection
          title="Content Moderation & Compliance"
          icon={<Shield className="w-4 h-4 text-red-400" />}
          badge="Moderation"
        >
          <ContentModerationSection />
        </CollapsibleSection>

        {/* Infrastructure */}
        <CollapsibleSection
          title="Infrastructure Monitor"
          icon={<Cpu className="w-4 h-4 text-emerald-400" />}
          badge="Live"
        >
          <InfrastructureSection />
        </CollapsibleSection>

        {/* Growth Analytics */}
        <CollapsibleSection
          title="Growth Analytics"
          icon={<TrendingUp className="w-4 h-4 text-blue-400" />}
        >
          <GrowthAnalyticsSection />
        </CollapsibleSection>

        {/* Monetization */}
        <CollapsibleSection
          title="Monetization & Billing"
          icon={<DollarSign className="w-4 h-4 text-yellow-400" />}
        >
          <MonetizationSection />
        </CollapsibleSection>

        {/* God Mode */}
        <CollapsibleSection
          title="God Mode — View as User"
          icon={<Eye className="w-4 h-4 text-purple-400" />}
        >
          <GodModeSection />
        </CollapsibleSection>

        {/* Verification */}
        <CollapsibleSection
          title="Creator Verification"
          icon={<BadgeCheck className="w-4 h-4 text-cyan-400" />}
        >
          <VerificationSection />
        </CollapsibleSection>

        {/* Advanced Admin Controls */}
        <AdminAdvancedTabs />
        <AdminMegaTabs />
      </div>
    </AdminErrorBoundary>
  );
}

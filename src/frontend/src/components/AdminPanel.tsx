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
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
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
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { AdminLink, CreatorReport } from "../backend";
import { NotificationType, UserStatus } from "../backend";
import { useActor } from "../hooks/useActor";
import { useGetOwnRole } from "../hooks/useGetOwnRole";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsOwner } from "../hooks/useIsOwner";
import ActivityLogTable from "./ActivityLogTable";
import AdminErrorBoundary from "./AdminErrorBoundary";
import AdminManagement from "./AdminManagement";
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
      </div>
    </AdminErrorBoundary>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  ExternalLink,
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
import type { AdminLink } from "../backend";
import { useActor } from "../hooks/useActor";
import { useGetOwnRole } from "../hooks/useGetOwnRole";
import { useIsOwner } from "../hooks/useIsOwner";
import ActivityLogTable from "./ActivityLogTable";
import AdminErrorBoundary from "./AdminErrorBoundary";
import AdminManagement from "./AdminManagement";
import { AdminMessaging } from "./AdminMessaging";
import AppAnalytics from "./AppAnalytics";
import FeedbackSubmissions from "./FeedbackSubmissions";
import { SystemControls } from "./SystemControls";
import UserStatusManagement from "./UserStatusManagement";

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

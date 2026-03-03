import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, FileText, Loader2, Lock, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { ContentEntry } from "../backend";
import { useActor } from "../hooks/useActor";
import { useGetOwnRole } from "../hooks/useGetOwnRole";

function useContentEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<ContentEntry[]>({
    queryKey: ["contentEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContentEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

function useCreateContentEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, body }: { title: string; body: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createContentEntry(title, body);
    },
    onSuccess: () => {
      toast.success("Content entry created");
      queryClient.invalidateQueries({ queryKey: ["contentEntries"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useUpdateContentEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      body,
    }: { id: string; title: string; body: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateContentEntry(id, title, body);
    },
    onSuccess: () => {
      toast.success("Content entry updated");
      queryClient.invalidateQueries({ queryKey: ["contentEntries"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useDeleteContentEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteContentEntry(id);
    },
    onSuccess: () => {
      toast.success("Content entry deleted");
      queryClient.invalidateQueries({ queryKey: ["contentEntries"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

interface EntryFormData {
  title: string;
  body: string;
}

export default function ContentManager() {
  const { data: ownRole, isLoading: roleLoading } = useGetOwnRole();
  const { data: entries, isLoading } = useContentEntries();
  const createMutation = useCreateContentEntry();
  const updateMutation = useUpdateContentEntry();
  const deleteMutation = useDeleteContentEntry();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editEntry, setEditEntry] = useState<ContentEntry | null>(null);
  const [formData, setFormData] = useState<EntryFormData>({
    title: "",
    body: "",
  });

  // Normalize role to string
  const roleStr = ownRole
    ? typeof ownRole === "object"
      ? Object.keys(ownRole)[0]
      : String(ownRole)
    : null;

  const isAuthorized = roleStr === "admin" || roleStr === "owner";

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-white font-bold text-xl mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          Content Manager is only accessible to managers, admins, and owners.
        </p>
      </div>
    );
  }

  const handleCreate = async () => {
    if (!formData.title.trim()) return;
    await createMutation.mutateAsync({
      title: formData.title,
      body: formData.body,
    });
    setShowCreateDialog(false);
    setFormData({ title: "", body: "" });
  };

  const handleUpdate = async () => {
    if (!editEntry || !formData.title.trim()) return;
    await updateMutation.mutateAsync({
      id: editEntry.id,
      title: formData.title,
      body: formData.body,
    });
    setEditEntry(null);
    setFormData({ title: "", body: "" });
  };

  const openEdit = (entry: ContentEntry) => {
    setEditEntry(entry);
    setFormData({ title: entry.title, body: entry.body });
  };

  const formatDate = (ts: bigint) => {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl font-display">
              Content Manager
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage content entries
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setFormData({ title: "", body: "" });
            setShowCreateDialog(true);
          }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="space-y-3">
          {["s1", "s2", "s3"].map((k) => (
            <Skeleton key={k} className="h-24 bg-white/5 rounded-xl" />
          ))}
        </div>
      ) : !entries || entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card">
          <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-30" />
          <h3 className="text-white font-semibold text-lg mb-2">
            No Content Entries
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create your first content entry to get started.
          </p>
          <Button
            onClick={() => {
              setFormData({ title: "", body: "" });
              setShowCreateDialog(true);
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="glass-card p-4 hover:bg-white/8 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {entry.title}
                  </h3>
                  <p className="text-muted-foreground text-xs line-clamp-2">
                    {entry.body}
                  </p>
                  <p className="text-muted-foreground/50 text-xs mt-2">
                    Updated {formatDate(entry.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(entry)}
                    className="h-8 w-8 text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0B0E14] border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Delete Entry?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          This will permanently delete "{entry.title}". This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(entry.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-[#0B0E14] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              Create Content Entry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Entry title..."
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50"
            />
            <Textarea
              value={formData.body}
              onChange={(e) =>
                setFormData((p) => ({ ...p, body: e.target.value }))
              }
              placeholder="Entry content..."
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowCreateDialog(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending || !formData.title.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editEntry}
        onOpenChange={(open) => {
          if (!open) setEditEntry(null);
        }}
      >
        <DialogContent className="bg-[#0B0E14] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Content Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Entry title..."
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50"
            />
            <Textarea
              value={formData.body}
              onChange={(e) =>
                setFormData((p) => ({ ...p, body: e.target.value }))
              }
              placeholder="Entry content..."
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditEntry(null)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending || !formData.title.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

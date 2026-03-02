import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsOwner } from '../hooks/useIsOwner';
import {
  useContentEntries,
  useCreateContentEntry,
  useUpdateContentEntry,
  useDeleteContentEntry,
} from '../hooks/useContentEntries';
import type { ContentEntry } from '../types/app';
import { Plus, Edit2, Trash2, FileText, LogIn, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ContentManager() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsOwner();
  const { data: entries = [], isLoading } = useContentEntries();
  const { mutate: createEntry, isPending: isCreating } = useCreateContentEntry();
  const { mutate: updateEntry, isPending: isUpdating } = useUpdateContentEntry();
  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteContentEntry();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ContentEntry | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="glass-card rounded-2xl p-8 text-center max-w-sm">
          <LogIn className="w-12 h-12 text-cyan-neon mx-auto mb-4" />
          <h2 className="font-orbitron text-lg text-cyan-neon mb-2">LOGIN REQUIRED</h2>
          <p className="text-muted-foreground text-sm">Please login to access content manager.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="glass-card rounded-2xl p-8 text-center max-w-sm">
          <Shield className="w-12 h-12 text-cyan-neon mx-auto mb-4" />
          <h2 className="font-orbitron text-lg text-cyan-neon mb-2">ADMIN ONLY</h2>
          <p className="text-muted-foreground text-sm">You need admin access to manage content.</p>
        </div>
      </div>
    );
  }

  const openCreate = () => {
    setEditingEntry(null);
    setTitle('');
    setBody('');
    setDialogOpen(true);
  };

  const openEdit = (entry: ContentEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setBody(entry.body);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    if (editingEntry) {
      updateEntry(
        { id: editingEntry.id, title, body },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      createEntry(
        { title, body },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-cyan-neon" />
            <div>
              <h1 className="font-orbitron text-xl text-cyan-neon">CONTENT MANAGER</h1>
              <p className="text-muted-foreground text-sm">Manage app content entries</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg cyberpunk-btn transition-smooth text-sm"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-cyan-neon/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">No content entries yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="glass-card rounded-2xl p-4 border border-cyan-neon/10 hover:border-cyan-neon/30 transition-smooth"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{entry.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated {formatDistanceToNow(new Date(Number(entry.updatedAt) / 1_000_000), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(entry)}
                    className="p-1.5 rounded-lg text-cyan-neon/60 hover:text-cyan-neon hover:bg-cyan-neon/10 transition-smooth"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    disabled={isDeleting}
                    className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-900/20 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border border-cyan-neon/30 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-cyan-neon">
              {editingEntry ? 'EDIT ENTRY' : 'NEW ENTRY'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title..."
                className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Entry content..."
                rows={6}
                className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth resize-none"
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-muted-foreground border border-cyan-neon/20 hover:border-cyan-neon/40 transition-smooth"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="px-4 py-2 rounded-lg text-sm cyberpunk-btn transition-smooth disabled:opacity-50"
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

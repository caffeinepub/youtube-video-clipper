import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFeedbackSubmit } from '../hooks/useFeedbackSubmit';
import type { SubmissionType } from '../types/app';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [submissionType, setSubmissionType] = useState<SubmissionType>('FeatureRequest');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { mutate: submitFeedback, isPending } = useFeedbackSubmit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    submitFeedback(
      { submissionType, title, description },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-card border border-cyan-neon/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-cyan-neon">SUBMIT FEEDBACK</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="flex gap-2">
            {(['FeatureRequest', 'BugReport'] as SubmissionType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSubmissionType(type)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-smooth ${
                  submissionType === type
                    ? 'cyberpunk-btn-active text-cyan-neon border-cyan-neon'
                    : 'border-cyan-neon/20 text-muted-foreground hover:border-cyan-neon/40'
                }`}
              >
                {type === 'FeatureRequest' ? '✨ Feature Request' : '🐛 Bug Report'}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary..."
              className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe in detail..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/20 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth resize-none"
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground border border-cyan-neon/20 hover:border-cyan-neon/40 transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !title.trim() || !description.trim()}
              className="px-4 py-2 rounded-lg text-sm cyberpunk-btn transition-smooth disabled:opacity-50"
            >
              {isPending ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

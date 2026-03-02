import React from 'react';
import { useFeedbackSubmissions } from '../hooks/useFeedbackSubmissions';
import { useDeleteFeedback } from '../hooks/useDeleteFeedback';
import { Trash2, Bug, Sparkles } from 'lucide-react';
import { generateShortUserId } from '../utils/userIdGenerator';
import { formatDistanceToNow } from 'date-fns';

export default function FeedbackSubmissions() {
  const { data: submissions = [], isLoading } = useFeedbackSubmissions();
  const { mutate: deleteFeedback, isPending: isDeleting } = useDeleteFeedback();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-cyan-neon/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No feedback submissions yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((sub) => (
        <div
          key={sub.id.toString()}
          className="glass-card rounded-xl p-4 border border-cyan-neon/10"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="shrink-0 mt-0.5">
                {sub.submissionType === 'BugReport' ? (
                  <Bug className="w-4 h-4 text-red-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-neon" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{sub.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    #{generateShortUserId(sub.submitterPrincipal)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(sub.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteFeedback(sub.id)}
              disabled={isDeleting}
              className="shrink-0 p-1.5 rounded-lg text-red-400 hover:bg-red-900/20 transition-smooth"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

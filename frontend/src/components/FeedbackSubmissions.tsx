import React, { useState } from 'react';
import { useFeedbackSubmissions } from '../hooks/useFeedbackSubmissions';
import { useDeleteFeedback } from '../hooks/useDeleteFeedback';
import { generateShortUserId } from '../utils/userIdGenerator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { Bug, Lightbulb, Trash2, Inbox } from 'lucide-react';

export default function FeedbackSubmissions() {
  const { data: submissions = [], isLoading } = useFeedbackSubmissions();
  const deleteFeedback = useDeleteFeedback();

  const formatTime = (ts: number | bigint) => {
    const ms = typeof ts === 'bigint' ? Number(ts) / 1_000_000 : Number(ts);
    const date = new Date(ms);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Inbox size={32} className="mx-auto mb-2 opacity-30" />
        <p className="text-sm">No feedback submissions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((sub: any) => {
        const isBug = sub.submissionType && ('BugReport' in sub.submissionType || sub.submissionType.__kind__ === 'BugReport');
        const shortId = sub.submitterPrincipal ? generateShortUserId(sub.submitterPrincipal) : sub.submitterUserId || 'unknown';
        return (
          <div key={String(sub.id)} className="bg-background/50 rounded-lg border border-border/30 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {isBug ? (
                  <Bug size={14} className="text-destructive shrink-0 mt-0.5" />
                ) : (
                  <Lightbulb size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{sub.title}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono text-primary">{shortId}</span>
                    {' · '}
                    {formatTime(sub.timestamp)}
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 size={14} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this feedback submission?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteFeedback.mutate(BigInt(sub.id))}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-5">{sub.description}</p>
          </div>
        );
      })}
    </div>
  );
}

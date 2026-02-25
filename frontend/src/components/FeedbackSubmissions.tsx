import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Lightbulb, Bug, Trash2, MessageSquare, User, Clock } from 'lucide-react';
import { useFeedbackSubmissions } from '../hooks/useFeedbackSubmissions';
import { useDeleteFeedback } from '../hooks/useDeleteFeedback';
import { generateShortUserId } from '../utils/userIdGenerator';
import { SubmissionType } from '../backend';

function formatTimestamp(timestamp: bigint): string {
  // Backend stores nanoseconds (ICP Time), convert to milliseconds
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function FeedbackSubmissions() {
  const { data: submissions, isLoading, error } = useFeedbackSubmissions();
  const { mutate: deleteSubmission, isPending: isDeleting } = useDeleteFeedback();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDelete = (id: bigint) => {
    setDeletingId(id);
    deleteSubmission(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load feedback submissions.'}
        </p>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No feedback submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => {
        const isFeature = submission.submissionType === SubmissionType.FeatureRequest ||
          (submission.submissionType as any).__kind__ === 'FeatureRequest' ||
          String(submission.submissionType) === 'FeatureRequest';
        const shortUserId = generateShortUserId(submission.submitterPrincipal);
        const isCurrentlyDeleting = isDeleting && deletingId === submission.id;

        return (
          <Card key={String(submission.id)} className="border border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Type badge + title */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={isFeature ? 'default' : 'destructive'}
                      className={`text-xs flex items-center gap-1 ${
                        isFeature
                          ? 'bg-blue-500/15 text-blue-600 border-blue-500/30 hover:bg-blue-500/20'
                          : ''
                      }`}
                    >
                      {isFeature ? (
                        <Lightbulb className="w-3 h-3" />
                      ) : (
                        <Bug className="w-3 h-3" />
                      )}
                      {isFeature ? 'Feature Request' : 'Bug Report'}
                    </Badge>
                    <span className="font-semibold text-sm truncate">{submission.title}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {submission.description}
                  </p>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="font-mono font-medium text-foreground">{shortUserId}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] opacity-70 max-w-[200px] truncate">
                      {submission.submitterPrincipal}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(submission.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      disabled={isCurrentlyDeleting}
                    >
                      {isCurrentlyDeleting ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this feedback submission? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(submission.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bug, Lightbulb, Send } from 'lucide-react';
import { useFeedbackSubmit } from '../hooks/useFeedbackSubmit';
import { toast } from 'sonner';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [type, setType] = useState<'bug' | 'feature'>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const submitFeedback = useFeedbackSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await submitFeedback.mutateAsync({
        submissionType: type === 'bug' ? { BugReport: null } : { FeatureRequest: null },
        title: title.trim(),
        description: description.trim(),
      });
      toast.success('Feedback submitted! Thank you!');
      setTitle('');
      setDescription('');
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Bug size={18} className="text-primary" />
            Report / Request
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Help us improve Beast Clipping by reporting bugs or requesting features.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Type</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as 'bug' | 'feature')} className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="bug" id="bug" />
                <Label htmlFor="bug" className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <Bug size={14} className="text-destructive" />
                  Bug Report
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="feature" id="feature" />
                <Label htmlFor="feature" className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <Lightbulb size={14} className="text-yellow-400" />
                  Feature Request
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1">
            <Label htmlFor="feedback-title" className="text-sm text-foreground">Title</Label>
            <Input
              id="feedback-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary..."
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="feedback-desc" className="text-sm text-foreground">Description</Label>
            <Textarea
              id="feedback-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe in detail..."
              className="bg-background border-border text-foreground resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitFeedback.isPending || !title.trim() || !description.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {submitFeedback.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={14} />
                  Submit
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Bug, Lightbulb, Loader2 } from "lucide-react";
import { useState } from "react";
import { SubmissionType } from "../backend";
import { useFeedbackSubmit } from "../hooks/useFeedbackSubmit";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [submissionType, setSubmissionType] = useState<SubmissionType>(
    SubmissionType.FeatureRequest,
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const { mutate: submitFeedback, isPending } = useFeedbackSubmit();

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    submitFeedback(
      { submissionType, title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setErrors({});
    setSubmissionType(SubmissionType.FeatureRequest);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Send Feedback</DialogTitle>
          <DialogDescription>
            Request a new feature or report a bug. Your user ID will be included
            with the submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Type Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Feedback Type</Label>
            <RadioGroup
              value={submissionType}
              onValueChange={(val) => setSubmissionType(val as SubmissionType)}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2 flex-1">
                <RadioGroupItem
                  value={SubmissionType.FeatureRequest}
                  id="feature"
                />
                <Label
                  htmlFor="feature"
                  className="flex items-center gap-2 cursor-pointer font-normal"
                >
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Request a Feature
                </Label>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <RadioGroupItem value={SubmissionType.BugReport} id="bug" />
                <Label
                  htmlFor="bug"
                  className="flex items-center gap-2 cursor-pointer font-normal"
                >
                  <Bug className="w-4 h-4 text-destructive" />
                  Report a Bug
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="feedback-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="feedback-title"
              placeholder={
                submissionType === SubmissionType.FeatureRequest
                  ? "e.g. Add dark mode support"
                  : "e.g. Clip timestamps not saving correctly"
              }
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title)
                  setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              disabled={isPending}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="feedback-description"
              className="text-sm font-medium"
            >
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="feedback-description"
              placeholder={
                submissionType === SubmissionType.FeatureRequest
                  ? "Describe the feature you would like to see..."
                  : "Describe the bug, steps to reproduce, and expected behavior..."
              }
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              disabled={isPending}
              rows={4}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

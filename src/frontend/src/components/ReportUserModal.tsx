import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation } from "@tanstack/react-query";
import { Flag, Loader2, ShieldAlert } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const REPORT_REASONS = [
  { value: "Spam", label: "Spam" },
  { value: "Harassment", label: "Harassment" },
  { value: "Fake profile", label: "Fake profile" },
  { value: "Inappropriate content", label: "Inappropriate content" },
  { value: "Other", label: "Other" },
];

function shortPrincipal(p: Principal): string {
  const s = p.toString();
  if (s.length <= 12) return s;
  return `${s.slice(0, 8)}...${s.slice(-4)}`;
}

interface ReportUserModalProps {
  open: boolean;
  onClose: () => void;
  reportedPrincipal: Principal;
  reportedName?: string;
}

export default function ReportUserModal({
  open,
  onClose,
  reportedPrincipal,
  reportedName,
}: ReportUserModalProps) {
  const { actor } = useActor();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const reportMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      if (!reason) throw new Error("Please select a reason");
      await actor.reportCreator(reportedPrincipal, reason, description.trim());
    },
    onSuccess: () => {
      toast.success("Report submitted — our team will review it shortly.");
      setReason("");
      setDescription("");
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to submit report. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Please select a reason for the report.");
      return;
    }
    reportMutation.mutate();
  };

  const handleClose = () => {
    if (reportMutation.isPending) return;
    setReason("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-[#0D1117] border border-red-500/20 text-white max-w-md"
        data-ocid="report.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <DialogTitle className="text-white font-bold text-lg font-display">
              Report Creator
            </DialogTitle>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Reporting{" "}
            <span className="text-red-400 font-mono text-xs">
              {reportedName ?? shortPrincipal(reportedPrincipal)}
            </span>
            . Our team reviews all reports within 24 hours.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Reason */}
          <div className="space-y-1.5">
            <Label
              htmlFor="report-reason"
              className="text-xs text-muted-foreground"
            >
              Reason <span className="text-red-400">*</span>
            </Label>
            <Select
              value={reason}
              onValueChange={setReason}
              data-ocid="report.select"
            >
              <SelectTrigger
                id="report-reason"
                className="bg-white/5 border-white/10 text-white focus:border-red-500/50 h-9"
                data-ocid="report.select"
              >
                <SelectValue placeholder="Select a reason…" />
              </SelectTrigger>
              <SelectContent className="bg-[#0D1117] border-white/10">
                {REPORT_REASONS.map((r) => (
                  <SelectItem
                    key={r.value}
                    value={r.value}
                    className="text-white hover:bg-white/5 focus:bg-white/5"
                  >
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="report-description"
              className="text-xs text-muted-foreground"
            >
              Additional details{" "}
              <span className="text-muted-foreground/50">(optional)</span>
            </Label>
            <Textarea
              id="report-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened…"
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-red-500/30 resize-none min-h-[90px] text-sm"
              maxLength={500}
              data-ocid="report.textarea"
            />
            <p className="text-muted-foreground/40 text-xs text-right">
              {description.length}/500
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={reportMutation.isPending}
              className="flex-1 h-9 text-sm text-muted-foreground hover:text-white hover:bg-white/5"
              data-ocid="report.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={reportMutation.isPending || !reason}
              className="flex-1 h-9 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 disabled:opacity-40"
              data-ocid="report.submit_button"
            >
              {reportMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  Submitting…
                </>
              ) : (
                <>
                  <Flag className="w-3.5 h-3.5 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

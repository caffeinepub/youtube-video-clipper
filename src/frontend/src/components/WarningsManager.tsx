import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@icp-sdk/core/principal";
import { AlertTriangle, Search, Trash2, UserX } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { NotificationType } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Warning,
  clearWarnings,
  getWarnings,
  issueWarning,
} from "../utils/warnings";

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}

export default function WarningsManager() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const myPrincipal = identity?.getPrincipal().toString() ?? "";

  // Issue warning state
  const [targetPrincipal, setTargetPrincipal] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  // View warnings state
  const [searchPrincipal, setSearchPrincipal] = useState("");
  const [viewedWarnings, setViewedWarnings] = useState<Warning[] | null>(null);
  const [viewedPrincipal, setViewedPrincipal] = useState("");

  const handleIssueWarning = async () => {
    if (!targetPrincipal.trim()) {
      toast.error("Please enter a target principal ID");
      return;
    }
    if (!warningMessage.trim()) {
      toast.error("Please enter a warning message");
      return;
    }
    const tp = targetPrincipal.trim();
    // Store locally
    issueWarning(tp, warningMessage.trim(), myPrincipal);
    // Also send a backend notification so the user sees it on-screen
    if (actor) {
      try {
        const recipientPrincipal = Principal.fromText(tp);
        const senderPrincipal =
          identity?.getPrincipal() ?? Principal.anonymous();
        await actor.addNotification(
          recipientPrincipal,
          `⚠️ Warning: ${warningMessage.trim()}`,
          NotificationType.system_announcement,
          senderPrincipal,
        );
      } catch (err) {
        console.warn(
          "[WarningsManager] Failed to send backend notification:",
          err,
        );
      }
    }
    toast.success(`Warning issued to ${tp.slice(0, 16)}...`);
    setTargetPrincipal("");
    setWarningMessage("");
    // Refresh the viewed warnings if looking at the same principal
    if (viewedPrincipal === tp) {
      setViewedWarnings(getWarnings(tp));
    }
  };

  const handleSearchWarnings = () => {
    if (!searchPrincipal.trim()) {
      toast.error("Please enter a principal ID to search");
      return;
    }
    const warnings = getWarnings(searchPrincipal.trim());
    setViewedWarnings(warnings);
    setViewedPrincipal(searchPrincipal.trim());
  };

  const handleClearWarnings = () => {
    if (!viewedPrincipal) return;
    clearWarnings(viewedPrincipal);
    setViewedWarnings([]);
    toast.success("All warnings cleared");
  };

  return (
    <div className="space-y-5">
      {/* Issue Warning Section */}
      <div className="glass-card p-4 space-y-3">
        <h4 className="text-white font-semibold text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          Issue Warning
        </h4>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Target Principal ID
            </Label>
            <Input
              placeholder="e.g. 7cho6-twidd-..."
              value={targetPrincipal}
              onChange={(e) => setTargetPrincipal(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-yellow-500/50 h-8 text-sm font-mono"
              data-ocid="warnings.input"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Warning Message
            </Label>
            <Textarea
              placeholder="Describe the reason for this warning..."
              value={warningMessage}
              onChange={(e) => setWarningMessage(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-yellow-500/50 text-sm resize-none min-h-[80px]"
              data-ocid="warnings.textarea"
            />
          </div>
          <Button
            size="sm"
            onClick={() => {
              handleIssueWarning();
            }}
            disabled={!targetPrincipal.trim() || !warningMessage.trim()}
            className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 h-8 text-xs"
            data-ocid="warnings.submit_button"
          >
            <AlertTriangle className="w-3 h-3 mr-1.5" />
            Issue Warning
          </Button>
        </div>
      </div>

      {/* View Warnings Section */}
      <div className="glass-card p-4 space-y-3">
        <h4 className="text-white font-semibold text-sm flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          View User Warnings
        </h4>
        <div className="flex gap-2">
          <Input
            placeholder="Enter principal ID to view warnings..."
            value={searchPrincipal}
            onChange={(e) => setSearchPrincipal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchWarnings()}
            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary/50 h-8 text-sm font-mono flex-1"
            data-ocid="warnings.search_input"
          />
          <Button
            size="sm"
            onClick={handleSearchWarnings}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 h-8 text-xs px-3"
          >
            <Search className="w-3 h-3" />
          </Button>
        </div>

        {viewedWarnings !== null && (
          <div className="space-y-3">
            {/* Header with count and clear button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
                  {viewedPrincipal.slice(0, 20)}...
                </span>
                {viewedWarnings.length > 0 && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs px-1.5 py-0">
                    <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                    {viewedWarnings.length} warning
                    {viewedWarnings.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              {viewedWarnings.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearWarnings}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 text-xs px-2"
                  data-ocid="warnings.delete_button"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Warning list */}
            {viewedWarnings.length === 0 ? (
              <div
                className="text-center py-4 text-muted-foreground text-xs"
                data-ocid="warnings.empty_state"
              >
                <UserX className="w-6 h-6 mx-auto mb-2 opacity-40" />
                No warnings found for this user
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
                {viewedWarnings.map((warning, idx) => (
                  <div
                    key={warning.id}
                    className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 space-y-1"
                    data-ocid={`warnings.item.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-yellow-300 text-xs font-medium flex-1">
                        {warning.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-[10px]">
                      <span>{formatTimestamp(warning.timestamp)}</span>
                      <span>·</span>
                      <span className="font-mono">
                        by {warning.issuedBy.slice(0, 12)}...
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

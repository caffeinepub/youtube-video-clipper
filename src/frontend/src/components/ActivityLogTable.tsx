import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Search } from "lucide-react";
import React, { useState } from "react";
import { useActivityLogs } from "../hooks/useActivityLogs";
import { generateShortUserId } from "../utils/userIdGenerator";

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ActivityLogTable() {
  const [search, setSearch] = useState("");
  const { data: logs, isLoading } = useActivityLogs();

  const filtered = (logs ?? []).filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.userPrincipal.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-indigo-400" />
          <h3 className="text-base font-semibold text-white font-display">
            Activity Logs
          </h3>
          {logs && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">
              {logs.length}
            </span>
          )}
        </div>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by action..."
            className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-indigo-500/60 text-sm w-48"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {["s1", "s2", "s3", "s4", "s5"].map((k) => (
            <Skeleton key={k} className="h-10 w-full rounded-lg bg-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {search ? "No logs match your filter." : "No activity logs yet."}
        </div>
      ) : (
        <div className="overflow-x-auto max-h-64 overflow-y-auto scrollbar-thin rounded-xl border border-white/5">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-indigo-300 text-xs">
                  User ID
                </TableHead>
                <TableHead className="text-indigo-300 text-xs">
                  Action
                </TableHead>
                <TableHead className="text-indigo-300 text-xs">
                  Timestamp
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 100).map((log) => (
                <TableRow
                  key={log.id}
                  className="border-white/5 hover:bg-white/3"
                >
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {generateShortUserId(log.userPrincipal)}
                  </TableCell>
                  <TableCell className="text-xs text-white/80 max-w-[200px] truncate">
                    {log.action}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

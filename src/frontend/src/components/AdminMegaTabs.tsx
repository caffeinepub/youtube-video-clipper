import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Bell,
  ChevronDown,
  ChevronUp,
  Cpu,
  Database,
  DollarSign,
  FileText,
  Flame,
  Globe,
  HardDrive,
  Key,
  Lock,
  MessageSquare,
  Music,
  Paintbrush,
  Play,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  Sparkles,
  Star,
  Tag,
  Terminal,
  Trash2,
  TrendingUp,
  Users,
  Video,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold text-sm text-white">
          {icon}
          {title}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </div>
  );
}

// ─── 1. System & Infrastructure ───────────────────────────────────────────────
function SystemInfraSection() {
  const [workers, setWorkers] = useState([
    { id: "W-01", name: "GPU Node Alpha", load: 87, active: true },
    { id: "W-02", name: "GPU Node Beta", load: 54, active: true },
    { id: "W-03", name: "GPU Node Gamma", load: 12, active: true },
    { id: "W-04", name: "GPU Node Delta", load: 0, active: false },
    { id: "W-05", name: "GPU Node Epsilon", load: 95, active: true },
    { id: "W-06", name: "CPU Encode 1", load: 33, active: true },
  ]);
  const [scaling, setScaling] = useState(false);
  const [purging, setPurging] = useState(false);
  const apis = [
    { name: "OpenAI", status: "healthy", latency: "142ms" },
    { name: "AssemblyAI", status: "healthy", latency: "89ms" },
    { name: "ElevenLabs", status: "degraded", latency: "512ms" },
    { name: "YouTube API", status: "healthy", latency: "203ms" },
  ];
  const errors = [
    { type: "Encoding Error", count: 14, last: "2m ago" },
    { type: "Source URL 404", count: 7, last: "8m ago" },
    { type: "GPU Out of Memory", count: 3, last: "1h ago" },
    { type: "Timeout: Assembly", count: 2, last: "3h ago" },
  ];
  const buckets = [
    { name: "s3://beastclipping-raw", used: 4.2, total: 10 },
    { name: "s3://beastclipping-exports", used: 2.8, total: 10 },
    { name: "gcs://bc-preview-cache", used: 0.6, total: 5 },
  ];

  return (
    <div className="space-y-4">
      {/* GPU Heatmap */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          GPU Cluster Heatmap
        </p>
        <div className="grid grid-cols-3 gap-2">
          {workers.map((w) => {
            const color =
              w.load > 80
                ? "bg-red-500"
                : w.load > 50
                  ? "bg-yellow-500"
                  : w.load > 0
                    ? "bg-green-500"
                    : "bg-gray-700";
            return (
              <div
                key={w.id}
                className={`rounded-lg p-2 ${color}/20 border border-${w.load > 80 ? "red" : w.load > 50 ? "yellow" : "green"}-500/30 text-center`}
              >
                <div
                  className={`text-xs font-bold ${w.load > 80 ? "text-red-400" : w.load > 50 ? "text-yellow-400" : w.active ? "text-green-400" : "text-gray-500"}`}
                >
                  {w.active ? `${w.load}%` : "OFF"}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {w.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Worker Toggle */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Worker Node Status
        </p>
        <div className="space-y-1">
          {workers.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between text-sm py-1 border-b border-white/5"
            >
              <span className="text-white/80">{w.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {w.active ? `${w.load}% load` : "Offline"}
                </span>
                <Switch
                  checked={w.active}
                  onCheckedChange={(v) =>
                    setWorkers((ws) =>
                      ws.map((x) =>
                        x.id === w.id
                          ? {
                              ...x,
                              active: v,
                              load: v ? Math.floor(Math.random() * 60) : 0,
                            }
                          : x,
                      ),
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Queue + Render Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-xs text-muted-foreground">Queue Depth</p>
          <p className="text-2xl font-bold text-white">23</p>
          <Progress value={46} className="mt-1 h-1" />
          <p className="text-[10px] text-muted-foreground mt-1">~4m avg wait</p>
        </div>
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-xs text-muted-foreground">Avg Render Time</p>
          <p className="text-2xl font-bold text-white">2m 14s</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            per 1 min of video
          </p>
        </div>
      </div>

      {/* Auto-Scale */}
      <Button
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        onClick={() => {
          setScaling(true);
          setTimeout(() => setScaling(false), 3000);
        }}
        disabled={scaling}
      >
        <Zap className="w-4 h-4 mr-2" />
        {scaling
          ? "Scaling Up... (2 instances launching)"
          : "Auto-Scale: Spin Up Instances"}
      </Button>

      {/* Storage Buckets */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Storage Buckets
        </p>
        <div className="space-y-2">
          {buckets.map((b) => (
            <div key={b.name}>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span className="font-mono">{b.name}</span>
                <span>
                  {b.used}TB / {b.total}TB
                </span>
              </div>
              <Progress value={(b.used / b.total) * 100} className="h-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Cache Purge */}
      <Button
        variant="outline"
        className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
        onClick={() => {
          setPurging(true);
          setTimeout(() => setPurging(false), 2000);
        }}
        disabled={purging}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {purging ? "Purging preview cache..." : "Cache Purge Tool"}
      </Button>

      {/* API Health */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          API Health Dashboard
        </p>
        <div className="grid grid-cols-2 gap-2">
          {apis.map((a) => (
            <div
              key={a.name}
              className="flex items-center justify-between rounded bg-white/5 px-3 py-2"
            >
              <span className="text-sm text-white">{a.name}</span>
              <div className="text-right">
                <Badge
                  className={`text-[10px] ${a.status === "healthy" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                >
                  {a.status}
                </Badge>
                <div className="text-[10px] text-muted-foreground">
                  {a.latency}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DB Latency */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          DB Query Latency
        </p>
        <div className="flex items-end gap-1 h-12">
          {[12, 18, 9, 23, 14, 11, 8, 16, 21, 10, 13, 7].map((v, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={i}
              className="flex-1 rounded-sm bg-indigo-500/60"
              style={{ height: `${(v / 23) * 100}%` }}
            />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Avg: 13ms — last 12 queries
        </p>
      </div>

      {/* Error Logs */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Error Log Aggregator
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Error Type</TableHead>
              <TableHead className="text-xs">Count</TableHead>
              <TableHead className="text-xs">Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errors.map((e) => (
              <TableRow key={e.type}>
                <TableCell className="text-xs text-red-400">{e.type}</TableCell>
                <TableCell>
                  <Badge variant="destructive" className="text-[10px]">
                    {e.count}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {e.last}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── 2. User & Subscription ────────────────────────────────────────────────────
function UserSubscriptionSection() {
  const [credits, setCredits] = useState("");
  const [creditUid, setCreditUid] = useState("");
  const [trialUid, setTrialUid] = useState("");
  const churnRisk = [
    { id: "abc-123", name: "GamerX99", lastUpload: "9d ago", plan: "Pro" },
    { id: "def-456", name: "StreamerPro", lastUpload: "12d ago", plan: "Free" },
    { id: "ghi-789", name: "PodcastKing", lastUpload: "8d ago", plan: "Pro" },
  ];
  const powerUsers = [
    { rank: 1, name: "ClipMaster", usage: "48.2 GB" },
    { rank: 2, name: "ViralEdge", usage: "31.7 GB" },
    { rank: 3, name: "b3as1", usage: "28.1 GB" },
    { rank: 4, name: "ProClipper", usage: "22.4 GB" },
    { rank: 5, name: "NightOwl", usage: "19.0 GB" },
  ];
  const vibes = ["Gamer", "Podcaster", "Agency", "Streamer", "Creator"];

  return (
    <div className="space-y-4">
      {/* MRR Chart */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Subscriber Growth / MRR
        </p>
        <div className="flex items-end gap-1 h-16">
          {[
            1200, 1350, 1280, 1500, 1620, 1580, 1750, 1900, 1840, 2100, 2250,
            2400,
          ].map((v, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={i}
              className="flex-1 rounded-sm bg-green-500/60"
              style={{ height: `${(v / 2400) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>Jan</span>
          <span>Jun</span>
          <span>Dec</span>
        </div>
        <p className="text-sm font-bold text-green-400 mt-1">
          MRR: $2,400{" "}
          <span className="text-xs text-green-300">↑ 18% vs last month</span>
        </p>
      </div>

      {/* Credit Adjuster */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Credit Adjuster
        </p>
        <Input
          placeholder="User Principal ID"
          value={creditUid}
          onChange={(e) => setCreditUid(e.target.value)}
          className="text-xs"
        />
        <div className="flex gap-2">
          <Input
            placeholder="Minutes to add/remove"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="text-xs flex-1"
          />
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => {
              if (creditUid && credits) {
                alert(`Adjusted ${credits} minutes for ${creditUid}`);
                setCreditUid("");
                setCredits("");
              }
            }}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Trial Extender */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Trial Extender (+7 days Pro)
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="User Principal ID"
            value={trialUid}
            onChange={(e) => setTrialUid(e.target.value)}
            className="text-xs flex-1"
          />
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              if (trialUid) {
                alert(`Extended Pro trial 7 days for ${trialUid}`);
                setTrialUid("");
              }
            }}
          >
            Extend
          </Button>
        </div>
      </div>

      {/* Churn Risk */}
      <div>
        <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
          Churn Risk Alerts
        </p>
        <div className="space-y-2">
          {churnRisk.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded bg-red-500/10 border border-red-500/20 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-white">{u.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  Last upload: {u.lastUpload} · {u.plan}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-red-500/30 text-red-400"
              >
                Re-engage
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Top Power Users */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Top 10 Power Users
        </p>
        <div className="space-y-1">
          {powerUsers.map((u) => (
            <div
              key={u.rank}
              className="flex items-center gap-3 py-1 border-b border-white/5"
            >
              <span className="text-xs font-bold text-yellow-400 w-4">
                #{u.rank}
              </span>
              <span className="text-sm text-white flex-1">{u.name}</span>
              <span className="text-xs text-muted-foreground">{u.usage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vibe Tagging */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          User Vibe Tagging
        </p>
        <div className="space-y-2">
          {["ClipMaster", "ViralEdge", "b3as1"].map((name) => (
            <div key={name} className="flex items-center justify-between">
              <span className="text-sm text-white">{name}</span>
              <select className="text-xs bg-white/10 border border-white/20 rounded px-2 py-1 text-white">
                {vibes.map((v) => (
                  <option key={v} value={v} className="bg-gray-900">
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 3. AI & Quality Control ───────────────────────────────────────────────────
function AIQualitySection() {
  const [selectedModel, setSelectedModel] = useState<"gpt4o" | "gemini">(
    "gpt4o",
  );
  const [findCaption, setFindCaption] = useState("");
  const [replaceCaption, setReplaceCaption] = useState("");

  return (
    <div className="space-y-4">
      {/* AI Model Selector */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          AI Model Selector (Hook Detection)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(["gpt4o", "gemini"] as const).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setSelectedModel(m)}
              className={`rounded-lg p-3 text-left border transition-all ${
                selectedModel === m
                  ? "border-indigo-500 bg-indigo-500/20"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <p className="text-sm font-bold text-white">
                {m === "gpt4o" ? "GPT-4o" : "Gemini 1.5"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {m === "gpt4o" ? "OpenAI · Fast" : "Google · Multimodal"}
              </p>
              {selectedModel === m && (
                <Badge className="mt-1 text-[10px] bg-indigo-500/30 text-indigo-300">
                  Active
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Transcription Accuracy */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Transcription Accuracy Rater
        </p>
        <p className="text-xs text-white/70 mb-2">
          Sample: "The player executed a flawless rotation and secured the win."
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Button
              key={s}
              size="sm"
              variant="outline"
              className="flex-1 text-xs border-yellow-500/30 text-yellow-400"
            >
              ★ {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Sentiment Dashboard */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Sentiment Dashboard
        </p>
        <div className="space-y-2">
          {[
            { label: "Gaming", pct: 42, color: "bg-cyan-500" },
            { label: "Hype", pct: 28, color: "bg-yellow-500" },
            { label: "Happy", pct: 18, color: "bg-green-500" },
            { label: "Angry", pct: 12, color: "bg-red-500" },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>{s.label}</span>
                <span>{s.pct}%</span>
              </div>
              <div className="h-2 rounded bg-white/10">
                <div
                  className={`h-2 rounded ${s.color}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Distribution */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Language Distribution
        </p>
        <div className="space-y-1">
          {[
            { lang: "English", pct: 68 },
            { lang: "Spanish", pct: 14 },
            { lang: "Portuguese", pct: 8 },
            { lang: "French", pct: 5 },
            { lang: "Other", pct: 5 },
          ].map((l) => (
            <div key={l.lang} className="flex items-center gap-2 text-xs">
              <span className="w-20 text-white/70">{l.lang}</span>
              <div className="flex-1 h-1.5 rounded bg-white/10">
                <div
                  className="h-1.5 rounded bg-indigo-500"
                  style={{ width: `${l.pct}%` }}
                />
              </div>
              <span className="text-muted-foreground">{l.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Caption Correction */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Manual Caption Correction (Global)
        </p>
        <Input
          placeholder="Find..."
          value={findCaption}
          onChange={(e) => setFindCaption(e.target.value)}
          className="text-xs"
        />
        <Input
          placeholder="Replace with..."
          value={replaceCaption}
          onChange={(e) => setReplaceCaption(e.target.value)}
          className="text-xs"
        />
        <Button
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs"
          onClick={() => {
            if (findCaption && replaceCaption) {
              alert(
                `Replaced "${findCaption}" → "${replaceCaption}" across all captions`,
              );
              setFindCaption("");
              setReplaceCaption("");
            }
          }}
        >
          Apply Global Replacement
        </Button>
      </div>

      {/* Hook Success Rate */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Hook Success Rate
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Hook Type</TableHead>
              <TableHead className="text-xs">CTR</TableHead>
              <TableHead className="text-xs">Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { type: "Question Hook", ctr: "8.4%", used: 234 },
              { type: "Shock Statement", ctr: "6.1%", used: 189 },
              { type: "Number List", ctr: "5.7%", used: 156 },
              { type: "Story Tease", ctr: "4.9%", used: 98 },
            ].map((h) => (
              <TableRow key={h.type}>
                <TableCell className="text-xs text-white">{h.type}</TableCell>
                <TableCell>
                  <Badge className="text-[10px] bg-green-500/20 text-green-400">
                    {h.ctr}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {h.used}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Transcription Cost */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Transcription Cost Calculator
        </p>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/70">This month total:</span>
          <span className="font-bold text-white">$247.80</span>
        </div>
        <div className="space-y-1">
          {[
            { user: "b3as1", cost: "$18.40" },
            { user: "ClipMaster", cost: "$14.20" },
            { user: "ViralEdge", cost: "$11.50" },
          ].map((c) => (
            <div key={c.user} className="flex justify-between text-xs">
              <span className="text-white/70">{c.user}</span>
              <span className="text-red-400">{c.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 4. Video & Media Management ──────────────────────────────────────────────
function VideoMediaSection() {
  const [bulkDays, setBulkDays] = useState("30");
  const [fontName, setFontName] = useState("");

  return (
    <div className="space-y-4">
      {/* Bulk Deleter */}
      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 space-y-2">
        <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
          Bulk Video Deleter
        </p>
        <div className="flex gap-2 items-center">
          <Label className="text-xs text-white/70">
            Delete videos older than
          </Label>
          <select
            className="text-xs bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
            value={bulkDays}
            onChange={(e) => setBulkDays(e.target.value)}
          >
            <option value="7" className="bg-gray-900">
              7 days
            </option>
            <option value="30" className="bg-gray-900">
              30 days
            </option>
            <option value="90" className="bg-gray-900">
              90 days
            </option>
          </select>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="w-full text-xs"
          onClick={() =>
            confirm(
              `Purge all clips older than ${bulkDays} days from inactive users?`,
            ) && alert("Bulk deletion queued")
          }
        >
          <Trash2 className="w-3 h-3 mr-1" /> Purge Inactive User Videos
        </Button>
      </div>

      {/* Format Breakdown */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Video Format Breakdown
        </p>
        <div className="space-y-1">
          {[
            { fmt: "MP4", pct: 72 },
            { fmt: "MOV", pct: 18 },
            { fmt: "MKV", pct: 7 },
            { fmt: "WebM", pct: 3 },
          ].map((f) => (
            <div key={f.fmt} className="flex items-center gap-2 text-xs">
              <span className="w-12 text-white/70">{f.fmt}</span>
              <div className="flex-1 h-2 rounded bg-white/10">
                <div
                  className="h-2 rounded bg-cyan-500"
                  style={{ width: `${f.pct}%` }}
                />
              </div>
              <span className="text-muted-foreground">{f.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Resolution */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Export Resolution Stats
        </p>
        <div className="flex gap-2">
          {[
            { res: "720p", pct: 35, color: "bg-blue-500" },
            { res: "1080p", pct: 52, color: "bg-indigo-500" },
            { res: "4K", pct: 13, color: "bg-purple-500" },
          ].map((r) => (
            <div key={r.res} className="flex-1 text-center">
              <div className="h-20 flex items-end justify-center mb-1">
                <div
                  className={`w-8 rounded-t ${r.color}`}
                  style={{ height: `${r.pct * 2}px` }}
                />
              </div>
              <p className="text-xs font-bold text-white">{r.pct}%</p>
              <p className="text-[10px] text-muted-foreground">{r.res}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Thumbnail Gallery (Latest 100)
        </p>
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={i}
              className="aspect-video rounded bg-gradient-to-br from-indigo-900 to-cyan-900 flex items-center justify-center"
            >
              <Video className="w-3 h-3 text-white/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Source Tracker */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Source Link Tracker
        </p>
        <div className="space-y-1">
          {[
            { src: "YouTube", pct: 58 },
            { src: "Twitch", pct: 24 },
            { src: "Direct Upload", pct: 18 },
          ].map((s) => (
            <div key={s.src} className="flex items-center gap-2 text-xs">
              <span className="w-24 text-white/70">{s.src}</span>
              <div className="flex-1 h-2 rounded bg-white/10">
                <div
                  className="h-2 rounded bg-purple-500"
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <span className="text-muted-foreground">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Font Manager */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Font Manager
        </p>
        <div className="space-y-1">
          {["Montserrat", "Bebas Neue", "Inter", "Oswald"].map((f) => (
            <div key={f} className="flex items-center justify-between text-xs">
              <span style={{ fontFamily: f }} className="text-white">
                {f}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400 h-6 text-xs"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Font name (.ttf)"
            value={fontName}
            onChange={(e) => setFontName(e.target.value)}
            className="text-xs"
          />
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-xs"
          >
            Upload
          </Button>
        </div>
      </div>

      {/* Template Performance */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Template Performance
        </p>
        {[
          { name: "Viral 9:16", uses: 1240 },
          { name: "TikTokify", uses: 987 },
          { name: "Gaming Hype", uses: 654 },
          { name: "Podcast Clip", uses: 432 },
        ].map((t) => (
          <div key={t.name} className="flex items-center gap-2 text-xs mb-2">
            <span className="w-24 text-white/70">{t.name}</span>
            <div className="flex-1 h-2 rounded bg-white/10">
              <div
                className="h-2 rounded bg-yellow-500"
                style={{ width: `${(t.uses / 1240) * 100}%` }}
              />
            </div>
            <span className="text-muted-foreground">{t.uses}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 5. Marketing & Sales ──────────────────────────────────────────────────────
function MarketingSection() {
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [codes, setCodes] = useState([
    { code: "BEAST50", discount: "50%", expiry: "Dec 31", uses: 42 },
    { code: "LAUNCH25", discount: "25%", expiry: "Jan 15", uses: 128 },
  ]);

  return (
    <div className="space-y-4">
      {/* Promo Codes */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Promo Code Generator
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Code (e.g. BEAST50)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="text-xs flex-1"
          />
          <Input
            placeholder="% off"
            value={promoDiscount}
            onChange={(e) => setPromoDiscount(e.target.value)}
            className="text-xs w-16"
          />
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-xs"
            onClick={() => {
              if (promoCode && promoDiscount) {
                setCodes((c) => [
                  {
                    code: promoCode,
                    discount: `${promoDiscount}%`,
                    expiry: "30d",
                    uses: 0,
                  },
                  ...c,
                ]);
                setPromoCode("");
                setPromoDiscount("");
              }
            }}
          >
            Create
          </Button>
        </div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {codes.map((c) => (
            <div
              key={c.code}
              className="flex items-center justify-between text-xs bg-white/5 rounded px-2 py-1"
            >
              <span className="font-mono font-bold text-green-400">
                {c.code}
              </span>
              <span className="text-white">{c.discount}</span>
              <span className="text-muted-foreground">{c.expiry}</span>
              <Badge variant="outline" className="text-[10px]">
                {c.uses} uses
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Announcement Banner
        </p>
        <Textarea
          placeholder="Write a message that appears on all user dashboards..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          className="text-xs resize-none"
          rows={2}
        />
        <Button
          size="sm"
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-xs"
          onClick={() => announcement && alert(`Banner set: "${announcement}"`)}
        >
          Push Banner to All Users
        </Button>
      </div>

      {/* Conversion Funnel */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Conversion Funnel
        </p>
        <div className="space-y-1">
          {[
            { step: "Signup", n: 1000, pct: 100 },
            { step: "Upload Video", n: 720, pct: 72 },
            { step: "Create Clip", n: 490, pct: 49 },
            { step: "Export", n: 310, pct: 31 },
            { step: "Share/Post", n: 180, pct: 18 },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-2 text-xs">
              <span className="w-24 text-white/70">{s.step}</span>
              <div className="flex-1 h-3 rounded bg-white/10">
                <div
                  className="h-3 rounded bg-gradient-to-r from-indigo-500 to-cyan-500"
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <span className="text-muted-foreground w-8 text-right">
                {s.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Churn Survey */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Churn Survey Results
        </p>
        {[
          { reason: "Too expensive", n: 34 },
          { reason: "Missing features", n: 28 },
          { reason: "Switched to competitor", n: 19 },
          { reason: "Just testing", n: 12 },
          { reason: "Other", n: 7 },
        ].map((r) => (
          <div key={r.reason} className="flex items-center gap-2 text-xs mb-1">
            <span className="w-36 text-white/70 truncate">{r.reason}</span>
            <div className="flex-1 h-2 rounded bg-white/10">
              <div
                className="h-2 rounded bg-red-400"
                style={{ width: `${(r.n / 34) * 100}%` }}
              />
            </div>
            <span className="text-muted-foreground">{r.n}</span>
          </div>
        ))}
      </div>

      {/* LTV Calculator */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          LTV Calculator
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { seg: "Free", ltv: "$0" },
            { seg: "Pro", ltv: "$148" },
            { seg: "Agency", ltv: "$624" },
          ].map((s) => (
            <div key={s.seg} className="text-center rounded bg-white/5 p-2">
              <p className="text-xs text-muted-foreground">{s.seg}</p>
              <p className="text-lg font-bold text-white">{s.ltv}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 6. Support & Troubleshooting ─────────────────────────────────────────────
function SupportSection() {
  const [maintenance, setMaintenance] = useState(false);
  const [debugVideoId, setDebugVideoId] = useState("");
  const [refundUid, setRefundUid] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  const tickets = [
    {
      id: "#1042",
      user: "GamerX99",
      issue: "Clip not exporting",
      status: "Open",
      time: "2h ago",
    },
    {
      id: "#1041",
      user: "StreamerPro",
      issue: "YouTube not connecting",
      status: "Pending",
      time: "5h ago",
    },
    {
      id: "#1040",
      user: "PodcastKing",
      issue: "Audio sync off",
      status: "Resolved",
      time: "1d ago",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Maintenance Mode */}
      <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-yellow-400">
              Maintenance Mode
            </p>
            <p className="text-xs text-muted-foreground">
              Put app into scheduled maintenance
            </p>
          </div>
          <Switch checked={maintenance} onCheckedChange={setMaintenance} />
        </div>
        {maintenance && (
          <div className="mt-2">
            <Input type="datetime-local" className="text-xs" />
            <p className="text-xs text-yellow-400 mt-1">
              ⚠ Users will see maintenance screen
            </p>
          </div>
        )}
      </div>

      {/* System Latency Alert */}
      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-400">
            System Latency Alert
          </p>
          <p className="text-xs text-muted-foreground">
            Render time is 1.4x baseline (within threshold)
          </p>
        </div>
        <Badge className="ml-auto bg-green-500/20 text-green-400 text-xs">
          OK
        </Badge>
      </div>

      {/* Ticket History */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Ticket History
        </p>
        <div className="space-y-2">
          {tickets.map((t) => (
            <div key={t.id} className="rounded bg-white/5 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  {t.id}
                </span>
                <Badge
                  className={`text-[10px] ${t.status === "Open" ? "bg-red-500/20 text-red-400" : t.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}
                >
                  {t.status}
                </Badge>
              </div>
              <p className="text-sm text-white">
                {t.user} — {t.issue}
              </p>
              <p className="text-[10px] text-muted-foreground">{t.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Debugger */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Video Playback Debugger
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Video ID"
            value={debugVideoId}
            onChange={(e) => setDebugVideoId(e.target.value)}
            className="text-xs flex-1"
          />
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-xs"
            onClick={() =>
              debugVideoId &&
              alert(
                "Codec: H.264 | Resolution: 1920x1080 | Bitrate: 8.4 Mbps | FPS: 60 | Container: MP4",
              )
            }
          >
            Debug
          </Button>
        </div>
      </div>

      {/* Refund */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Refund Shortcut
        </p>
        <Input
          placeholder="User Principal ID"
          value={refundUid}
          onChange={(e) => setRefundUid(e.target.value)}
          className="text-xs"
        />
        <div className="flex gap-2">
          <Input
            placeholder="Amount ($)"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            className="text-xs flex-1"
          />
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-xs"
            onClick={() => {
              if (refundUid && refundAmount) {
                alert(`Refund of $${refundAmount} processed for ${refundUid}`);
                setRefundUid("");
                setRefundAmount("");
              }
            }}
          >
            Process
          </Button>
        </div>
      </div>

      {/* App Update Logs */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          App Update Logs
        </p>
        <div className="space-y-1">
          {[
            { v: "v86", note: "YouTube Studio expanded", date: "Today" },
            { v: "v85", note: "100+ creative features", date: "2d ago" },
            { v: "v84", note: "AI editor panel", date: "4d ago" },
            { v: "v83", note: "reka.ai download style", date: "1w ago" },
          ].map((u) => (
            <div
              key={u.v}
              className="flex items-center gap-2 text-xs border-b border-white/5 py-1"
            >
              <Badge variant="outline" className="text-[10px] font-mono">
                {u.v}
              </Badge>
              <span className="text-white/70 flex-1">{u.note}</span>
              <span className="text-muted-foreground">{u.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 7. Security & Compliance ─────────────────────────────────────────────────
function SecurityComplianceSection() {
  const [rotatingKey, setRotatingKey] = useState<string | null>(null);
  const gdprQueue = [
    { id: "abc-111", name: "UserA", submitted: "3d ago" },
    { id: "def-222", name: "UserB", submitted: "1w ago" },
  ];

  return (
    <div className="space-y-4">
      {/* 2FA Tracker */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          2FA Status Tracker
        </p>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">34%</p>
            <p className="text-xs text-muted-foreground">2FA Enabled</p>
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-2 rounded bg-white/10">
              <div
                className="h-2 rounded bg-green-500"
                style={{ width: "34%" }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              340 of 1,000 users have 2FA on
            </p>
          </div>
        </div>
      </div>

      {/* API Key Manager */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          API Key Manager
        </p>
        <div className="space-y-2">
          {[
            { name: "YouTube API", key: "AIza••••••••••••Xk9p" },
            { name: "OpenAI", key: "sk-••••••••••••••••••" },
            { name: "AssemblyAI", key: "ae12••••••••••••••••" },
          ].map((k) => (
            <div
              key={k.name}
              className="flex items-center justify-between rounded bg-white/5 px-3 py-2"
            >
              <div>
                <p className="text-xs font-medium text-white">{k.name}</p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {k.key}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => {
                  setRotatingKey(k.name);
                  setTimeout(() => setRotatingKey(null), 1500);
                }}
                disabled={rotatingKey === k.name}
              >
                <RefreshCw
                  className={`w-3 h-3 mr-1 ${rotatingKey === k.name ? "animate-spin" : ""}`}
                />
                {rotatingKey === k.name ? "Rotating..." : "Rotate"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Login Audit Log */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Login Audit Log
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Admin</TableHead>
              <TableHead className="text-xs">IP</TableHead>
              <TableHead className="text-xs">Action</TableHead>
              <TableHead className="text-xs">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                admin: "Owner",
                ip: "192.168.1.1",
                action: "Banned user",
                t: "5m ago",
              },
              {
                admin: "Mod1",
                ip: "10.0.0.4",
                action: "Viewed flagged",
                t: "1h ago",
              },
              {
                admin: "Owner",
                ip: "192.168.1.1",
                action: "Updated banner",
                t: "2h ago",
              },
            ].map((l, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              <TableRow key={i}>
                <TableCell className="text-xs text-white">{l.admin}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  {l.ip}
                </TableCell>
                <TableCell className="text-xs text-white/70">
                  {l.action}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {l.t}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Suspicious Activity */}
      <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-3">
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">
          Suspicious Activity Flags
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white">
              bot-attempt-99 — 847 uploads in 1h
            </p>
            <Button size="sm" variant="destructive" className="text-xs h-6">
              Ban
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            No other flags in the last 24h
          </p>
        </div>
      </div>

      {/* GDPR Queue */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          GDPR Deletion Queue
        </p>
        <div className="space-y-2">
          {gdprQueue.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded bg-white/5 px-3 py-2"
            >
              <div>
                <p className="text-xs text-white">{r.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  Submitted {r.submitted}
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="destructive" className="text-xs h-6">
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-6">
                  Deny
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Encryption Status */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Encryption Status
        </p>
        {[
          "S3 at-rest (AES-256)",
          "GCS at-rest (AES-256)",
          "HTTPS in-transit (TLS 1.3)",
          "DB encrypted (AES-256)",
          "API keys encrypted",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-xs py-0.5">
            <span className="text-green-400">✓</span>
            <span className="text-white/70">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 8. Creative & UI Customization ───────────────────────────────────────────
function CreativeUISection() {
  const [theme, setTheme] = useState<"dark" | "light" | "contrast">("dark");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [customCSS, setCustomCSS] = useState("");

  return (
    <div className="space-y-4">
      {/* Theme Switcher */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Theme Switcher
        </p>
        <div className="flex gap-2">
          {(["dark", "light", "contrast"] as const).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={theme === t ? "default" : "outline"}
              className={`flex-1 text-xs capitalize ${theme === t ? "bg-indigo-600" : ""}`}
              onClick={() => setTheme(t)}
            >
              {t === "contrast"
                ? "High Contrast"
                : t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Brand Colors */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Brand Color Palette
        </p>
        <div className="flex items-center gap-3">
          <Label className="text-xs text-white/70">Primary</Label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0"
          />
          <span className="text-xs font-mono text-muted-foreground">
            {primaryColor}
          </span>
        </div>
        <div className="flex gap-2">
          {["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"].map((c) => (
            <button
              type="button"
              key={c}
              className="w-6 h-6 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: primaryColor === c ? "white" : "transparent",
              }}
              onClick={() => setPrimaryColor(c)}
            />
          ))}
        </div>
      </div>

      {/* CSS Injector */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Default CSS Injector
        </p>
        <Textarea
          placeholder="/* Inject custom CSS for the user editor */\n.clip-editor { font-size: 14px; }"
          value={customCSS}
          onChange={(e) => setCustomCSS(e.target.value)}
          className="text-xs font-mono resize-none"
          rows={4}
        />
        <Button
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs"
          onClick={() => customCSS && alert("Custom CSS pushed to user editor")}
        >
          Inject CSS
        </Button>
      </div>

      {/* Loading Animation Picker */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Loading Animation Picker
        </p>
        <div className="grid grid-cols-4 gap-2">
          {["Spinner", "Pulse", "Bars", "Dots"].map((a, i) => (
            <button
              type="button"
              key={a}
              className={`rounded-lg p-2 border text-center text-xs transition-all ${i === 0 ? "border-indigo-500 bg-indigo-500/20" : "border-white/10 bg-white/5"}`}
            >
              <div className="text-lg mb-1">{["⏳", "💫", "📊", "•••"][i]}</div>
              <span className="text-white/70">{a}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Pairing */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Font Pairing Suggestions
        </p>
        {[
          { h: "Montserrat", b: "Inter" },
          { h: "Bebas Neue", b: "Open Sans" },
          { h: "Playfair Display", b: "Lato" },
        ].map((fp) => (
          <div
            key={fp.h}
            className="flex items-center justify-between rounded bg-white/5 px-3 py-2 mb-1"
          >
            <div>
              <p
                className="text-sm font-bold text-white"
                style={{ fontFamily: fp.h }}
              >
                {fp.h}
              </p>
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: fp.b }}
              >
                {fp.b} body
              </p>
            </div>
            <Button size="sm" variant="outline" className="text-xs">
              Apply
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 9. Advanced Admin Magic ───────────────────────────────────────────────────
function AdvancedMagicSection() {
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchResult, setBenchResult] = useState<null | {
    fps: number;
    time: string;
    score: number;
  }>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [prompt, setPrompt] = useState("");

  return (
    <div className="space-y-4">
      {/* Big Red Button */}
      <div className="rounded-lg bg-red-900/30 border border-red-500/40 p-4 text-center">
        <p className="text-xs text-red-400 mb-2 uppercase tracking-wider">
          Emergency Kill Switch
        </p>
        <Button
          variant="destructive"
          className="w-full text-sm font-bold py-3 bg-red-600 hover:bg-red-700"
          onClick={() =>
            confirm(
              "⚠️ KILL ALL ACTIVE RENDERS? This will interrupt all in-progress jobs.",
            ) &&
            confirm("Are you absolutely sure?") &&
            alert("All render tasks killed. Queue cleared.")
          }
        >
          🔴 THE BIG RED BUTTON — KILL ALL RENDERS
        </Button>
      </div>

      {/* Benchmarking */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Pre-Render Benchmarking
        </p>
        <Button
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs"
          disabled={benchmarking}
          onClick={() => {
            setBenchmarking(true);
            setBenchResult(null);
            setTimeout(() => {
              setBenchmarking(false);
              setBenchResult({ fps: 58, time: "1m 47s", score: 94 });
            }, 2500);
          }}
        >
          {benchmarking ? "Running benchmark test clip..." : "Run Benchmark"}
        </Button>
        {benchResult && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded bg-white/5 p-2">
              <p className="text-xs text-muted-foreground">FPS</p>
              <p className="text-lg font-bold text-white">{benchResult.fps}</p>
            </div>
            <div className="rounded bg-white/5 p-2">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-lg font-bold text-white">{benchResult.time}</p>
            </div>
            <div className="rounded bg-white/5 p-2">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-lg font-bold text-green-400">
                {benchResult.score}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Prompt Playground */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          AI Prompt Playground
        </p>
        <Textarea
          placeholder="Test a Short-finding prompt, e.g. 'Find the most exciting 30 seconds where the player scores...' "
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="text-xs resize-none"
          rows={3}
        />
        <Button
          size="sm"
          className="w-full bg-purple-600 hover:bg-purple-700 text-xs"
          onClick={() =>
            prompt &&
            alert(
              "Prompt test result:\n\nTimestamp: 4:32-5:02\nConfidence: 92%\nReason: Peak audio + score event detected",
            )
          }
        >
          Run Against Test Video
        </Button>
      </div>

      {/* Webhook Tester */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Webhook Tester
        </p>
        <Input
          placeholder="Webhook URL"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          className="text-xs"
        />
        <select className="w-full text-xs bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white">
          {[
            "Clip Finished",
            "New User Signup",
            "Export Complete",
            "Error Alert",
          ].map((ev) => (
            <option key={ev} className="bg-gray-900">
              {ev}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs"
          onClick={() =>
            webhookUrl &&
            alert(`✓ Test payload sent to ${webhookUrl}\nResponse: 200 OK`)
          }
        >
          Send Test Payload
        </Button>
      </div>

      {/* DB Index Monitor */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Database Index Monitor
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Table</TableHead>
              <TableHead className="text-xs">Rows</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { t: "clips", rows: "2.4M", ok: true },
              { t: "users", rows: "48K", ok: true },
              { t: "transcripts", rows: "1.8M", ok: false },
              { t: "activity_logs", rows: "9.2M", ok: false },
            ].map((r) => (
              <TableRow key={r.t}>
                <TableCell className="text-xs font-mono text-white">
                  {r.t}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {r.rows}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-[10px] ${r.ok ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}
                  >
                    {r.ok ? "OK" : "Needs Index"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Slack/Discord Bot */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Slack/Discord Bot Config
        </p>
        <Input placeholder="Slack webhook URL" className="text-xs" />
        <Input placeholder="Discord webhook URL" className="text-xs" />
        <div className="space-y-1">
          {["New Signup", "New Clip", "Error Alert", "Revenue Milestone"].map(
            (e) => (
              <div
                key={e}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-white/70">{e}</span>
                <Switch defaultChecked={e !== "Error Alert"} />
              </div>
            ),
          )}
        </div>
        <Button
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs"
        >
          Save Bot Config
        </Button>
      </div>

      {/* App Version Rollback */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          App Version Rollback
        </p>
        <div className="space-y-1">
          {[
            { v: "v85", note: "Creative features", date: "2d ago" },
            { v: "v84", note: "AI editor", date: "4d ago" },
            { v: "v83", note: "reka downloads", date: "1w ago" },
          ].map((u) => (
            <div
              key={u.v}
              className="flex items-center justify-between rounded bg-white/5 px-3 py-2"
            >
              <div>
                <span className="text-xs font-mono font-bold text-white">
                  {u.v}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {u.note}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {u.date}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-6"
                  onClick={() =>
                    confirm(`Rollback to ${u.v}?`) &&
                    alert(`Rolling back to ${u.v}...`)
                  }
                >
                  Rollback
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 10. Finishing Touches ─────────────────────────────────────────────────────
function FinishingTouchesSection() {
  const [notes, setNotes] = useState([
    { id: 1, text: "Fix YouTube OAuth issues", color: "bg-yellow-500" },
    { id: 2, text: "Prepare v87 feature list", color: "bg-cyan-500" },
    { id: 3, text: "Review churn report", color: "bg-purple-500" },
  ]);
  const [newNote, setNewNote] = useState("");
  const [todos, setTodos] = useState([
    { id: 1, text: "Test new GPU cluster", done: false },
    { id: 2, text: "Update TOS v2.3", done: true },
    { id: 3, text: "Run benchmark", done: false },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [partyMode, setPartyMode] = useState(false);
  const [partyParticles, setPartyParticles] = useState<
    { id: number; x: number; y: number; c: string }[]
  >([]);
  const [sqlQuery, setSqlQuery] = useState("");
  const [sqlResult, setSqlResult] = useState("");
  const [threads, setThreads] = useState(4);

  const triggerParty = () => {
    setPartyMode(true);
    const particles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      c: [
        "bg-yellow-400",
        "bg-pink-500",
        "bg-cyan-400",
        "bg-green-400",
        "bg-purple-500",
        "bg-red-500",
      ][Math.floor(Math.random() * 6)],
    }));
    setPartyParticles(particles);
    setTimeout(() => {
      setPartyMode(false);
      setPartyParticles([]);
    }, 4000);
  };

  return (
    <div className="space-y-4 relative">
      {/* Party confetti overlay */}
      {partyMode && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {partyParticles.map((p) => (
            <div
              key={p.id}
              className={`absolute w-3 h-3 rounded-sm ${p.c} animate-bounce`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDuration: `${0.5 + Math.random()}s`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 rounded-2xl px-8 py-6 text-center">
              <p className="text-4xl mb-2">🎉</p>
              <p className="text-2xl font-bold text-yellow-400">
                MILESTONE HIT!
              </p>
              <p className="text-white/70">Revenue milestone reached!</p>
            </div>
          </div>
        </div>
      )}

      {/* Global Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Global search: users, clips, transactions..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="pl-9 text-sm"
        />
        {globalSearch && (
          <div className="absolute top-full mt-1 w-full rounded-lg bg-gray-900 border border-white/10 shadow-xl z-10 p-2">
            <p className="text-xs text-muted-foreground px-2 mb-1">
              Results for "{globalSearch}"
            </p>
            {[
              `User: ${globalSearch}99`,
              `Clip: "${globalSearch} highlight"`,
              `Transaction: #TX-${globalSearch.slice(0, 4)}`,
            ].map((r) => (
              <div
                key={r}
                className="text-xs text-white px-2 py-1 hover:bg-white/5 rounded cursor-pointer"
              >
                {r}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Party Mode */}
      <Button
        onClick={triggerParty}
        className="w-full bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:opacity-90 font-bold text-white"
      >
        🎉 PARTY MODE — Revenue Milestone!
      </Button>

      {/* Admin Notes */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Admin Notes (Sticky)
        </p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {notes.map((n) => (
            <div
              key={n.id}
              className={`rounded-lg p-3 ${n.color}/20 border ${n.color.replace("bg-", "border-")}/30 relative group`}
            >
              <p className="text-xs text-white">{n.text}</p>
              <button
                type="button"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-400 text-xs"
                onClick={() =>
                  setNotes((ns) => ns.filter((x) => x.id !== n.id))
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="New sticky note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="text-xs flex-1"
          />
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-xs"
            onClick={() => {
              if (newNote) {
                setNotes((n) => [
                  ...n,
                  {
                    id: Date.now(),
                    text: newNote,
                    color: [
                      "bg-yellow-500",
                      "bg-cyan-500",
                      "bg-purple-500",
                      "bg-green-500",
                    ][Math.floor(Math.random() * 4)],
                  },
                ]);
                setNewNote("");
              }
            }}
          >
            Add
          </Button>
        </div>
      </div>

      {/* To-Do List */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Personal To-Do List
        </p>
        <div className="space-y-1 mb-2">
          {todos.map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() =>
                  setTodos((ts) =>
                    ts.map((x) =>
                      x.id === t.id ? { ...x, done: !x.done } : x,
                    ),
                  )
                }
                className="accent-indigo-500"
              />
              <span
                className={`text-xs flex-1 ${t.done ? "line-through text-muted-foreground" : "text-white"}`}
              >
                {t.text}
              </span>
              <button
                type="button"
                className="text-red-400 text-xs"
                onClick={() =>
                  setTodos((ts) => ts.filter((x) => x.id !== t.id))
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="New task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="text-xs flex-1"
          />
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-xs"
            onClick={() => {
              if (newTodo) {
                setTodos((t) => [
                  ...t,
                  { id: Date.now(), text: newTodo, done: false },
                ]);
                setNewTodo("");
              }
            }}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Server Cost Projection */}
      <div className="rounded-lg bg-white/5 p-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Server Cost Projection (AI)
        </p>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/70">Projected Month-End AWS Bill:</span>
          <span className="font-bold text-white">$1,247</span>
        </div>
        <div className="space-y-1">
          {[
            { item: "EC2 GPU", cost: "$780" },
            { item: "S3 Storage", cost: "$240" },
            { item: "CloudFront CDN", cost: "$147" },
            { item: "RDS DB", cost: "$80" },
          ].map((c) => (
            <div key={c.item} className="flex justify-between text-xs">
              <span className="text-white/70">{c.item}</span>
              <span className="text-muted-foreground">{c.cost}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API Quota Alarm */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          API Quota Alarms
        </p>
        {[
          { api: "YouTube Data API", used: 82, limit: 100, warn: true },
          { api: "OpenAI GPT", used: 45, limit: 100, warn: false },
          { api: "AssemblyAI", used: 61, limit: 100, warn: false },
        ].map((a) => (
          <div key={a.api} className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className={a.warn ? "text-red-400" : "text-white/70"}>
                {a.api} {a.warn && "⚠"}
              </span>
              <span className="text-muted-foreground">{a.used}%</span>
            </div>
            <Progress
              value={a.used}
              className={`h-1.5 ${a.warn ? "[&>div]:bg-red-500" : ""}`}
            />
          </div>
        ))}
      </div>

      {/* Export Speed Booster */}
      <div className="rounded-lg bg-white/5 p-3 space-y-2">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Export Speed Booster
        </p>
        <div className="flex items-center gap-3">
          <Label className="text-xs text-white/70 flex-shrink-0">
            Render Threads: {threads}
          </Label>
          <input
            type="range"
            min={1}
            max={16}
            value={threads}
            onChange={(e) => setThreads(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
        </div>
        <Button
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs"
          onClick={() =>
            alert(`Allocated ${threads} threads to priority render queue`)
          }
        >
          Boost Priority Render Queue
        </Button>
      </div>

      {/* SQL Console */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
          Direct Database SQL Console ⚠ Power Admins Only
        </p>
        <Textarea
          placeholder="SELECT * FROM clips WHERE created_at > NOW() - INTERVAL '1 hour';"
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          className="text-xs font-mono resize-none"
          rows={3}
        />
        <Button
          size="sm"
          className="w-full bg-red-600 hover:bg-red-700 text-xs"
          onClick={() => {
            if (!sqlQuery) return;
            setSqlResult(
              `Query executed.\n\n3 rows returned:\n{ id: 'clip_001', user: 'GamerX99', duration: 45 }\n{ id: 'clip_002', user: 'ViralEdge', duration: 30 }\n{ id: 'clip_003', user: 'b3as1', duration: 60 }`,
            );
          }}
        >
          <Terminal className="w-3 h-3 mr-1" /> Execute Query
        </Button>
        {sqlResult && (
          <pre className="text-[10px] text-green-400 bg-black/50 rounded p-2 overflow-x-auto font-mono">
            {sqlResult}
          </pre>
        )}
      </div>

      {/* Feature Usage Heatmap */}
      <div>
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          Feature Usage Heatmap
        </p>
        <div className="grid grid-cols-4 gap-1">
          {[
            { f: "Clip", n: 1240 },
            { f: "Export", n: 987 },
            { f: "Captions", n: 654 },
            { f: "Share", n: 521 },
            { f: "Download", n: 498 },
            { f: "Schedule", n: 234 },
            { f: "Collab", n: 187 },
            { f: "Games", n: 143 },
          ].map((feat) => {
            const pct = feat.n / 1240;
            const color =
              pct > 0.7
                ? "bg-red-500"
                : pct > 0.4
                  ? "bg-orange-500"
                  : pct > 0.2
                    ? "bg-yellow-500"
                    : "bg-blue-500";
            return (
              <div
                key={feat.f}
                className={`rounded p-2 text-center ${color}/20 border ${color.replace("bg-", "border-")}/30`}
              >
                <p className="text-xs text-white">{feat.f}</p>
                <p
                  className={`text-[10px] font-bold ${color.replace("bg-", "text-")}`}
                >
                  {feat.n}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function AdminMegaTabs() {
  return (
    <div className="space-y-3 mt-3">
      <div className="px-1 py-0.5">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
          Advanced Admin Suite
        </h3>
      </div>

      <CollapsibleSection
        title="System & Infrastructure"
        icon={<Server className="w-4 h-4 text-cyan-400" />}
      >
        <SystemInfraSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="User & Subscription Management"
        icon={<Users className="w-4 h-4 text-purple-400" />}
      >
        <UserSubscriptionSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="AI & Content Quality Control"
        icon={<Sparkles className="w-4 h-4 text-yellow-400" />}
      >
        <AIQualitySection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Video & Media Management"
        icon={<Video className="w-4 h-4 text-blue-400" />}
      >
        <VideoMediaSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Marketing & Sales"
        icon={<TrendingUp className="w-4 h-4 text-green-400" />}
      >
        <MarketingSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Support & Troubleshooting"
        icon={<Wrench className="w-4 h-4 text-orange-400" />}
      >
        <SupportSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Security & Compliance"
        icon={<Shield className="w-4 h-4 text-red-400" />}
      >
        <SecurityComplianceSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Creative & UI Customization"
        icon={<Paintbrush className="w-4 h-4 text-pink-400" />}
      >
        <CreativeUISection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Advanced Admin Magic"
        icon={<Zap className="w-4 h-4 text-yellow-400" />}
      >
        <AdvancedMagicSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Finishing Touches"
        icon={<Star className="w-4 h-4 text-yellow-400" />}
      >
        <FinishingTouchesSection />
      </CollapsibleSection>
    </div>
  );
}

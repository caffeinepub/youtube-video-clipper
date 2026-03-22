import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Bell,
  Building2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Cpu,
  Database,
  DollarSign,
  FileText,
  Flame,
  Globe,
  HardDrive,
  Languages,
  LayoutDashboard,
  Link2,
  RefreshCw,
  Server,
  Settings2,
  ShieldCheck,
  Sliders,
  Tag,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

function Section({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <span className="text-white font-semibold text-sm">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="border-t border-white/8 p-4">{children}</div>}
    </div>
  );
}

function StatBar({
  label,
  value,
  color = "bg-primary",
}: { label: string; value: number; color?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs text-white font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ResourceMonitor() {
  const [activeRenders] = useState(4);
  const workers = [
    { id: "worker-01", status: "active", load: 78 },
    { id: "worker-02", status: "active", load: 45 },
    { id: "worker-03", status: "idle", load: 5 },
    { id: "worker-04", status: "active", load: 92 },
  ];
  return (
    <Section
      title="Resource Monitor"
      icon={<Cpu className="w-3.5 h-3.5 text-emerald-400" />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 rounded-xl p-3 border border-white/8 text-center">
            <p className="text-2xl font-black text-primary">{activeRenders}</p>
            <p className="text-xs text-muted-foreground">Active Renders</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/8 text-center">
            <p className="text-2xl font-black text-yellow-400">12</p>
            <p className="text-xs text-muted-foreground">Queue Depth</p>
          </div>
        </div>
        <div className="space-y-3">
          <StatBar label="CPU Usage" value={67} color="bg-blue-500" />
          <StatBar label="GPU Utilization" value={45} color="bg-purple-500" />
          <StatBar label="Memory" value={71} color="bg-orange-500" />
          <StatBar label="Storage I/O" value={34} color="bg-emerald-500" />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
            Worker Nodes
          </p>
          {workers.map((w) => (
            <div
              key={w.id}
              className="flex items-center gap-3 py-1.5 px-2 bg-white/5 rounded-lg"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${w.status === "active" ? "bg-green-400" : "bg-muted-foreground"}`}
              />
              <span className="text-xs text-white font-mono flex-1">
                {w.id}
              </span>
              <span className="text-xs text-muted-foreground">{w.status}</span>
              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${w.load}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">
                {w.load}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FeatureToggles() {
  const [features, setFeatures] = useState([
    {
      id: "autocrop",
      label: "AI Auto-Crop",
      free: false,
      pro: true,
      ent: true,
    },
    {
      id: "eyecontact",
      label: "Eye Contact Correction",
      free: false,
      pro: true,
      ent: true,
    },
    {
      id: "bgswap",
      label: "Background Swapper",
      free: false,
      pro: true,
      ent: true,
    },
    { id: "turbo", label: "Turbo Mode", free: false, pro: true, ent: true },
    {
      id: "templates",
      label: "Template Sharing",
      free: false,
      pro: true,
      ent: true,
    },
    {
      id: "captions",
      label: "Auto-Captions",
      free: true,
      pro: true,
      ent: true,
    },
    {
      id: "collaboredit",
      label: "Collaborative Editing",
      free: false,
      pro: false,
      ent: true,
    },
    {
      id: "whitelabel",
      label: "White-label",
      free: false,
      pro: false,
      ent: true,
    },
  ]);

  const toggle = (id: string, tier: "free" | "pro" | "ent") => {
    setFeatures(
      features.map((f) =>
        f.id === id ? { ...f, [tier]: !f[tier as keyof typeof f] } : f,
      ),
    );
    toast.success("Feature toggle updated");
  };

  return (
    <Section
      title="Feature Toggles"
      icon={<Sliders className="w-3.5 h-3.5 text-blue-400" />}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="text-muted-foreground text-xs">
              Feature
            </TableHead>
            <TableHead className="text-muted-foreground text-xs text-center">
              Free
            </TableHead>
            <TableHead className="text-muted-foreground text-xs text-center">
              Pro
            </TableHead>
            <TableHead className="text-muted-foreground text-xs text-center">
              Enterprise
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((f) => (
            <TableRow key={f.id} className="border-white/8">
              <TableCell className="text-white text-xs py-2">
                {f.label}
              </TableCell>
              <TableCell className="text-center py-2">
                <Switch
                  checked={f.free}
                  onCheckedChange={() => toggle(f.id, "free")}
                  className="scale-75"
                />
              </TableCell>
              <TableCell className="text-center py-2">
                <Switch
                  checked={f.pro}
                  onCheckedChange={() => toggle(f.id, "pro")}
                  className="scale-75"
                />
              </TableCell>
              <TableCell className="text-center py-2">
                <Switch
                  checked={f.ent}
                  onCheckedChange={() => toggle(f.id, "ent")}
                  className="scale-75"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

function UsageHeatmap() {
  const tools = [
    { name: "Clip Create", uses: 4821, hot: true },
    { name: "Auto-Captions", uses: 3210, hot: true },
    { name: "Export TikTok", uses: 2987, hot: true },
    { name: "Silence Remove", uses: 1654 },
    { name: "Highlight Detect", uses: 1203 },
    { name: "Color Grading", uses: 987 },
    { name: "Transitions", uses: 754 },
    { name: "B-Roll Gen", uses: 521 },
    { name: "Brand Kit", uses: 312 },
    { name: "Eye Contact", uses: 89, cold: true },
  ];

  const maxUses = Math.max(...tools.map((t) => t.uses));

  return (
    <Section
      title="Usage Heatmap"
      icon={<Flame className="w-3.5 h-3.5 text-orange-400" />}
    >
      <div className="grid grid-cols-2 gap-2">
        {tools.map((t) => {
          const intensity = t.uses / maxUses;
          const bg = t.hot
            ? `rgba(0,242,255,${0.1 + intensity * 0.35})`
            : t.cold
              ? "rgba(255,255,255,0.04)"
              : `rgba(0,242,255,${0.05 + intensity * 0.15})`;
          return (
            <div
              key={t.name}
              className="p-2.5 rounded-xl border border-white/10 flex items-center justify-between"
              style={{ background: bg }}
            >
              <span className="text-xs text-white">{t.name}</span>
              <span
                className={`text-xs font-bold ${t.hot ? "text-primary" : "text-muted-foreground"}`}
              >
                {t.uses.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ChurnPredictor() {
  const users = [
    {
      name: "creator_xx91",
      lastUpload: "14 days ago",
      risk: 87,
      action: "Send re-engagement email",
    },
    {
      name: "vlogmaster22",
      lastUpload: "21 days ago",
      risk: 93,
      action: "Offer discount",
    },
    {
      name: "gamer_clips",
      lastUpload: "9 days ago",
      risk: 62,
      action: "Send feature tip",
    },
    {
      name: "podcastpro",
      lastUpload: "5 days ago",
      risk: 38,
      action: "Monitor",
    },
  ];
  return (
    <Section
      title="Churn Predictor"
      icon={<TrendingDown className="w-3.5 h-3.5 text-red-400" />}
    >
      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u.name}
            className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/8"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium">{u.name}</p>
              <p className="text-xs text-muted-foreground">
                Last upload: {u.lastUpload}
              </p>
              <p className="text-xs text-yellow-400/80 mt-0.5">{u.action}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className={`text-sm font-black ${u.risk >= 80 ? "text-red-400" : u.risk >= 60 ? "text-yellow-400" : "text-green-400"}`}
              >
                {u.risk}%
              </p>
              <p className="text-[10px] text-muted-foreground">churn risk</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function DiscountEngine() {
  const [codes, setCodes] = useState([
    { code: "BEAST20", pct: 20, expiry: "2026-04-01", uses: 34 },
    { code: "LAUNCH50", pct: 50, expiry: "2026-03-31", uses: 12 },
  ]);
  const [newCode, setNewCode] = useState("");
  const [newPct, setNewPct] = useState("10");
  const [newExpiry, setNewExpiry] = useState("");

  return (
    <Section
      title="Discount Engine"
      icon={<Tag className="w-3.5 h-3.5 text-yellow-400" />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            placeholder="CODE"
            className="bg-white/5 border-white/10 text-white text-xs h-8 font-mono"
          />
          <Input
            value={newPct}
            onChange={(e) => setNewPct(e.target.value)}
            placeholder="% off"
            type="number"
            className="bg-white/5 border-white/10 text-white text-xs h-8"
          />
          <Input
            value={newExpiry}
            onChange={(e) => setNewExpiry(e.target.value)}
            type="date"
            className="bg-white/5 border-white/10 text-white text-xs h-8"
          />
        </div>
        <Button
          size="sm"
          className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 text-xs h-8"
          onClick={() => {
            if (newCode.trim()) {
              setCodes([
                ...codes,
                {
                  code: newCode,
                  pct: +newPct,
                  expiry: newExpiry || "No expiry",
                  uses: 0,
                },
              ]);
              setNewCode("");
              setNewPct("10");
              setNewExpiry("");
              toast.success(`Promo code ${newCode} created!`);
            }
          }}
          data-ocid="admin.discount.save_button"
        >
          Create Promo Code
        </Button>
        <div className="space-y-2">
          {codes.map((c, i) => (
            <div
              key={c.code}
              className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/8"
            >
              <code className="text-xs text-yellow-300 font-bold font-mono flex-1">
                {c.code}
              </code>
              <span className="text-xs text-white">{c.pct}% off</span>
              <span className="text-xs text-muted-foreground">{c.expiry}</span>
              <span className="text-xs text-muted-foreground">
                {c.uses} uses
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(c.code);
                  toast.success("Copied!");
                }}
                className="text-xs text-primary hover:text-primary/80"
              >
                📋
              </button>
              <button
                type="button"
                onClick={() => {
                  setCodes(codes.filter((_, j) => j !== i));
                  toast.success("Code deleted");
                }}
                className="text-xs text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function APIUsageTracker() {
  const services = [
    { name: "Transcription (AssemblyAI)", cost: 42.3, calls: 1204 },
    { name: "Export Processing", cost: 18.9, calls: 892 },
    { name: "Object Detection (Replicate)", cost: 9.4, calls: 231 },
    { name: "TTS Generation", cost: 5.2, calls: 87 },
    { name: "Storage (S3)", cost: 12.8, calls: 5400 },
  ];
  const total = services.reduce((s, r) => s + r.cost, 0);
  return (
    <Section
      title="API Usage Tracker"
      icon={<Code2 className="w-3.5 h-3.5 text-purple-400" />}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2.5 bg-primary/10 rounded-xl border border-primary/20">
          <span className="text-sm text-white font-semibold">
            Total This Month
          </span>
          <span className="text-xl font-black text-primary">
            ${total.toFixed(2)}
          </span>
        </div>
        {services.map((s) => (
          <div key={s.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {s.calls.toLocaleString()} calls
                </span>
                <span className="text-xs text-white font-semibold">
                  ${s.cost.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${(s.cost / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ExportQueue() {
  const items = [
    {
      user: "creator_pro1",
      clip: "Hype Moment #42",
      status: "processing",
      isPro: true,
      pct: 67,
    },
    {
      user: "vlogmaster22",
      clip: "Tutorial Intro",
      status: "processing",
      isPro: true,
      pct: 23,
    },
    {
      user: "free_user01",
      clip: "Gaming Clip",
      status: "queued",
      isPro: false,
      pct: 0,
    },
    {
      user: "free_user02",
      clip: "Funny Moment",
      status: "queued",
      isPro: false,
      pct: 0,
    },
    {
      user: "editor_elite",
      clip: "Brand Video",
      status: "done",
      isPro: true,
      pct: 100,
    },
  ];
  return (
    <Section
      title="Export Queue Manager"
      icon={<LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />}
    >
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.clip}
            className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/8"
          >
            {item.isPro && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-[10px] flex-shrink-0">
                PRO
              </Badge>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium truncate">
                {item.clip}
              </p>
              <p className="text-xs text-muted-foreground">{item.user}</p>
            </div>
            {item.status === "processing" && (
              <div className="w-24">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-primary">Processing</span>
                  <span className="text-[10px] text-muted-foreground">
                    {item.pct}%
                  </span>
                </div>
                <Progress value={item.pct} className="h-1.5" />
              </div>
            )}
            {item.status === "queued" && (
              <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                Queued
              </span>
            )}
            {item.status === "done" && (
              <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                Done
              </span>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function StorageAuditor() {
  const files = [
    {
      name: "podcast_ep12_raw.mp4",
      user: "podcastpro",
      size: "2.4 GB",
      tier: "Free",
    },
    {
      name: "gaming_marathon_3hr.mp4",
      user: "gamer_clips",
      size: "1.8 GB",
      tier: "Pro",
    },
    {
      name: "vlog_backup_hd.mp4",
      user: "vlogmaster22",
      size: "1.1 GB",
      tier: "Pro",
    },
    {
      name: "old_stream_720.mp4",
      user: "creator_xx91",
      size: "890 MB",
      tier: "Free",
    },
    {
      name: "unused_intro_4k.mp4",
      user: "editor_elite",
      size: "760 MB",
      tier: "Enterprise",
    },
  ];
  const tiers = [
    { label: "Free", size: "12.4 GB", pct: 24 },
    { label: "Pro", size: "28.9 GB", pct: 57 },
    { label: "Enterprise", size: "9.8 GB", pct: 19 },
  ];
  return (
    <Section
      title="Storage Auditor"
      icon={<HardDrive className="w-3.5 h-3.5 text-orange-400" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
            By Tier — 51.1 GB total
          </p>
          {tiers.map((t) => (
            <div key={t.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white">{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.size}</span>
              </div>
              <Progress value={t.pct} className="h-2" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
            Largest Files
          </p>
          {files.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/8"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground">
                  {f.user} · {f.tier}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {f.size}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 px-2 flex-shrink-0"
                onClick={() =>
                  toast.success(`Purge request sent for ${f.name}`)
                }
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ReferralDashboard() {
  const referrers = [
    { user: "creator_pro1", signups: 47, converted: 31, rate: 66 },
    { user: "vlogmaster22", signups: 29, converted: 18, rate: 62 },
    { user: "gaming_elite", signups: 22, converted: 11, rate: 50 },
    { user: "podcastpro", signups: 14, converted: 6, rate: 43 },
  ];
  return (
    <Section
      title="Referral Dashboard"
      icon={<TrendingUp className="w-3.5 h-3.5 text-green-400" />}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="text-muted-foreground text-xs">
              User
            </TableHead>
            <TableHead className="text-muted-foreground text-xs text-right">
              Signups
            </TableHead>
            <TableHead className="text-muted-foreground text-xs text-right">
              Converted
            </TableHead>
            <TableHead className="text-muted-foreground text-xs text-right">
              Rate
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrers.map((r) => (
            <TableRow key={r.user} className="border-white/8">
              <TableCell className="text-white text-xs py-2 font-medium">
                {r.user}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs py-2 text-right">
                {r.signups}
              </TableCell>
              <TableCell className="text-white text-xs py-2 text-right">
                {r.converted}
              </TableCell>
              <TableCell className="py-2 text-right">
                <span
                  className={`text-xs font-bold ${r.rate >= 60 ? "text-green-400" : "text-yellow-400"}`}
                >
                  {r.rate}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

function FeedbackLoop() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      title: "Dark mode for export preview",
      votes: 142,
      status: "planned",
    },
    {
      id: 2,
      title: "Batch export to all platforms at once",
      votes: 98,
      status: "under_review",
    },
    {
      id: 3,
      title: "AI-generated thumbnail picker",
      votes: 87,
      status: "done",
    },
    {
      id: 4,
      title: "Twitch VOD direct import",
      votes: 71,
      status: "under_review",
    },
    { id: 5, title: "Offline editing mode", votes: 34, status: "under_review" },
  ]);

  const statusColors: Record<string, string> = {
    under_review: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    planned: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    done: "bg-green-500/15 text-green-300 border-green-500/30",
  };

  const statuses = ["under_review", "planned", "done"];

  return (
    <Section
      title="Feedback Loop"
      icon={<Bell className="w-3.5 h-3.5 text-pink-400" />}
    >
      <div className="space-y-2">
        {requests.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/8"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white">{r.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-primary font-bold">
                  ▲ {r.votes}
                </span>
                <select
                  value={r.status}
                  onChange={(e) => {
                    setRequests(
                      requests.map((x) =>
                        x.id === r.id ? { ...x, status: e.target.value } : x,
                      ),
                    );
                    toast.success("Status updated");
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded border ${statusColors[r.status]} bg-transparent focus:outline-none cursor-pointer`}
                  data-ocid="admin.feedback.select"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="bg-[#0B0E14]">
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SystemStatus() {
  const services = [
    { name: "API Gateway", status: "operational", latency: "24ms" },
    { name: "Rendering Engine", status: "operational", latency: "180ms" },
    { name: "Storage (S3)", status: "operational", latency: "45ms" },
    { name: "Auth Service", status: "operational", latency: "12ms" },
    { name: "Transcription AI", status: "degraded", latency: "890ms" },
  ];
  const statusColor = (s: string) =>
    s === "operational"
      ? "bg-green-400"
      : s === "degraded"
        ? "bg-yellow-400"
        : "bg-red-400";
  const statusText = (s: string) =>
    s === "operational"
      ? "text-green-400"
      : s === "degraded"
        ? "text-yellow-400"
        : "text-red-400";
  return (
    <Section
      title="System Status"
      icon={<Server className="w-3.5 h-3.5 text-emerald-400" />}
    >
      <div className="space-y-2">
        {services.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/8"
          >
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusColor(s.status)}`}
            />
            <span className="text-xs text-white flex-1 font-medium">
              {s.name}
            </span>
            <span className={`text-xs font-semibold ${statusText(s.status)}`}>
              {s.status}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {s.latency}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function MultiTenant() {
  const orgs = [
    {
      name: "Agency Alpha",
      members: 12,
      storage: "45 GB",
      domain: "alpha.beastclip.io",
    },
    {
      name: "CreatorCo Studio",
      members: 6,
      storage: "22 GB",
      domain: "creatorcostudio.beastclip.io",
    },
    {
      name: "GameClip Enterprise",
      members: 34,
      storage: "180 GB",
      domain: "gameclip.beastclip.io",
    },
  ];
  return (
    <Section
      title="Multi-Tenant"
      icon={<Building2 className="w-3.5 h-3.5 text-indigo-400" />}
    >
      <div className="space-y-2">
        {orgs.map((o) => (
          <div
            key={o.name}
            className="p-3 bg-white/5 rounded-xl border border-white/8 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white font-semibold">{o.name}</p>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px]">
                Enterprise
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                <Users className="w-3 h-3 inline mr-1" />
                {o.members} members
              </span>
              <span>
                <HardDrive className="w-3 h-3 inline mr-1" />
                {o.storage}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-mono">{o.domain}</span>
            </div>
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="w-full border-white/10 text-muted-foreground hover:text-white text-xs h-8"
          onClick={() => toast.info("Multi-tenant org creation form")}
        >
          + Add Organization
        </Button>
      </div>
    </Section>
  );
}

function AuditLogs() {
  const logs = [
    {
      user: "Owner",
      action: "Updated shutdown message",
      when: "2m ago",
      ip: "192.168.1.1",
    },
    {
      user: "Admin #2",
      action: "Banned user free_user99",
      when: "14m ago",
      ip: "10.0.0.45",
    },
    {
      user: "Owner",
      action: "Toggled Eye Contact Correction",
      when: "1h ago",
      ip: "192.168.1.1",
    },
    {
      user: "Admin #3",
      action: "Deleted report ID #847",
      when: "3h ago",
      ip: "172.16.0.12",
    },
    {
      user: "Owner",
      action: "Changed PayPal donation URL",
      when: "1d ago",
      ip: "192.168.1.1",
    },
  ];
  return (
    <Section
      title="Audit Logs"
      icon={<FileText className="w-3.5 h-3.5 text-gray-400" />}
    >
      <div className="space-y-1.5">
        {logs.map((l) => (
          <div
            key={`${l.user}-${l.when}`}
            className="flex items-start gap-3 p-2 bg-white/5 rounded-lg border border-white/8"
          >
            <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white">
                <span className="text-primary font-semibold">{l.user}</span> —{" "}
                {l.action}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {l.when} · IP: {l.ip}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function RefundTool() {
  const [refunds, setRefunds] = useState([
    {
      id: "R001",
      user: "creator_xx91",
      clip: "Gaming Compilation",
      reason: "Encoding failed",
      amount: "$9.99",
    },
    {
      id: "R002",
      user: "vlogmaster22",
      clip: "Travel Vlog Edit",
      reason: "Export timeout",
      amount: "$4.99",
    },
    {
      id: "R003",
      user: "podcastpro",
      clip: "Ep 22 Processing",
      reason: "Audio desync",
      amount: "$9.99",
    },
  ]);
  return (
    <Section
      title="Automated Refund Tool"
      icon={<DollarSign className="w-3.5 h-3.5 text-red-400" />}
    >
      <div className="space-y-2">
        {refunds.map((r, i) => (
          <div
            key={r.id}
            className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/8"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium">{r.clip}</p>
              <p className="text-xs text-muted-foreground">
                {r.user} · {r.reason}
              </p>
            </div>
            <span className="text-xs text-white font-bold">{r.amount}</span>
            <Button
              size="sm"
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs h-7 px-3"
              onClick={() => {
                setRefunds(refunds.filter((_, j) => j !== i));
                toast.success(`Refund ${r.amount} issued to ${r.user}`);
              }}
              data-ocid="admin.refund.button"
            >
              Issue Refund
            </Button>
          </div>
        ))}
        {refunds.length === 0 && (
          <p
            className="text-xs text-muted-foreground text-center py-4"
            data-ocid="admin.refund.empty_state"
          >
            No pending refunds
          </p>
        )}
      </div>
    </Section>
  );
}

function DatabaseHealth() {
  const tables = [
    { name: "clips", rows: "128,441", size: "2.1 GB", index: "healthy" },
    { name: "users", rows: "4,821", size: "45 MB", index: "healthy" },
    {
      name: "messages",
      rows: "31,204",
      size: "180 MB",
      index: "needs_rebuild",
    },
    { name: "activity_logs", rows: "2.1M", size: "5.4 GB", index: "healthy" },
  ];
  return (
    <Section
      title="Database Health"
      icon={<Database className="w-3.5 h-3.5 text-blue-400" />}
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Query Speed (avg ms)
          </Label>
          {[
            ["Read queries", 8, "bg-green-500"],
            ["Write queries", 45, "bg-blue-500"],
            ["Complex joins", 187, "bg-orange-500"],
          ].map(([l, v, c]) => (
            <StatBar
              key={l as string}
              label={l as string}
              value={Math.min(100, (v as number) / 2)}
              color={c as string}
            />
          ))}
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-muted-foreground text-xs">
                Table
              </TableHead>
              <TableHead className="text-muted-foreground text-xs text-right">
                Rows
              </TableHead>
              <TableHead className="text-muted-foreground text-xs text-right">
                Size
              </TableHead>
              <TableHead className="text-muted-foreground text-xs text-right">
                Index
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((t) => (
              <TableRow key={t.name} className="border-white/8">
                <TableCell className="text-white text-xs font-mono py-2">
                  {t.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs py-2 text-right">
                  {t.rows}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs py-2 text-right">
                  {t.size}
                </TableCell>
                <TableCell className="py-2 text-right">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border ${t.index === "healthy" ? "bg-green-500/15 text-green-300 border-green-500/30" : "bg-yellow-500/15 text-yellow-300 border-yellow-500/30"}`}
                  >
                    {t.index}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          size="sm"
          variant="outline"
          className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs h-8"
          onClick={() => toast.success("Database optimization queued")}
          data-ocid="admin.db.button"
        >
          <RefreshCw className="w-3 h-3 mr-1.5" /> Run Optimization
        </Button>
      </div>
    </Section>
  );
}

function LanguageManager() {
  const [strings, setStrings] = useState([
    {
      key: "nav.dashboard",
      en: "Dashboard",
      es: "Panel",
      fr: "Tableau",
      de: "Dashboard",
    },
    {
      key: "nav.clips",
      en: "My Clips",
      es: "Mis Clips",
      fr: "Mes Clips",
      de: "Meine Clips",
    },
    {
      key: "action.save",
      en: "Save",
      es: "Guardar",
      fr: "Enregistrer",
      de: "Speichern",
    },
    {
      key: "action.delete",
      en: "Delete",
      es: "Eliminar",
      fr: "Supprimer",
      de: "Löschen",
    },
  ]);
  return (
    <Section
      title="Language Manager"
      icon={<Languages className="w-3.5 h-3.5 text-cyan-400" />}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              {["Key", "EN", "ES", "FR", "DE"].map((h) => (
                <th
                  key={h}
                  className="text-muted-foreground font-medium py-2 px-1 text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {strings.map((s, i) => (
              <tr key={s.key} className="border-b border-white/5">
                <td className="py-1.5 px-1 font-mono text-primary">{s.key}</td>
                {(["en", "es", "fr", "de"] as const).map((lang) => (
                  <td key={lang} className="py-1.5 px-1">
                    <Input
                      value={s[lang]}
                      onChange={(e) => {
                        const updated = [...strings];
                        updated[i] = { ...updated[i], [lang]: e.target.value };
                        setStrings(updated);
                      }}
                      className="bg-white/5 border-white/10 text-white text-xs h-7 px-2 min-w-0"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        size="sm"
        className="mt-3 w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs h-8"
        onClick={() => toast.success("Translations saved!")}
        data-ocid="admin.language.save_button"
      >
        Save Translations
      </Button>
    </Section>
  );
}

function UserSegmentation() {
  const [filter, setFilter] = useState("all");
  const segments = [
    { id: "creator", label: "Creator", count: 3241, color: "text-cyan-400" },
    { id: "agency", label: "Agency", count: 189, color: "text-purple-400" },
    {
      id: "enterprise",
      label: "Enterprise",
      count: 42,
      color: "text-yellow-400",
    },
  ];
  const users = [
    { name: "creator_pro1", type: "Creator", plan: "Pro", clips: 234 },
    { name: "agency_team", type: "Agency", plan: "Enterprise", clips: 1204 },
    { name: "gaming_elite", type: "Creator", plan: "Free", clips: 45 },
    { name: "studio_alpha", type: "Agency", plan: "Pro", clips: 567 },
  ];
  return (
    <Section
      title="User Segmentation"
      icon={<Users className="w-3.5 h-3.5 text-violet-400" />}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {segments.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFilter(s.id === filter ? "all" : s.id)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                filter === s.id
                  ? "bg-primary/15 border-primary/40"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <p className={`text-lg font-black ${s.color}`}>
                {s.count.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          {users
            .filter((u) => filter === "all" || u.type.toLowerCase() === filter)
            .map((u) => (
              <div
                key={u.name}
                className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/8"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.type} · {u.plan}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {u.clips} clips
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-primary hover:bg-primary/10 h-6 px-2"
                  onClick={() => toast.info(`Actions for ${u.name}`)}
                >
                  Actions
                </Button>
              </div>
            ))}
        </div>
      </div>
    </Section>
  );
}

function StorageQuotaAlerts() {
  const [threshold, setThreshold] = useState(90);
  const nearLimit = [
    { user: "gaming_marathon", used: 94, limit: "10 GB" },
    { user: "vlogmaster22", used: 91, limit: "10 GB" },
    { user: "free_user07", used: 88, limit: "2 GB" },
  ];
  return (
    <Section
      title="Storage Quota Alerts"
      icon={<AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Alert Threshold
            </Label>
            <span className="text-sm text-primary font-bold">{threshold}%</span>
          </div>
          <Slider
            value={[threshold]}
            onValueChange={([v]) => setThreshold(v)}
            min={50}
            max={99}
            step={1}
            className="w-full"
          />
          <Button
            size="sm"
            className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs h-8"
            onClick={() =>
              toast.success(`Alert threshold set to ${threshold}%`)
            }
            data-ocid="admin.quota.save_button"
          >
            Save Alert Config
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold">
            Users Near Limit
          </p>
          {nearLimit.map((u) => (
            <div
              key={u.user}
              className="space-y-1 p-2.5 bg-yellow-500/5 rounded-xl border border-yellow-500/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-white">{u.user}</span>
                <span className="text-xs text-yellow-400 font-bold">
                  {u.used}% / {u.limit}
                </span>
              </div>
              <Progress value={u.used} className="h-1.5" />
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-yellow-400 hover:bg-yellow-500/10 h-6 px-2 w-full"
                onClick={() =>
                  toast.success(`Storage warning sent to ${u.user}`)
                }
              >
                Send Warning
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function WhiteLabelSettings() {
  const [domain, setDomain] = useState("");
  const [accentColor, setAccentColor] = useState("#00f2ff");
  return (
    <Section
      title="White-label Settings"
      icon={<Settings2 className="w-3.5 h-3.5 text-gray-400" />}
    >
      <div className="space-y-3">
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
          Enterprise Only
        </Badge>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Custom Domain</Label>
          <div className="flex gap-2">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="app.yourcompany.com"
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-8"
              data-ocid="admin.whitelabel.input"
            />
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-8 px-3"
              onClick={() =>
                toast.success("Domain saved — DNS propagation may take 24-48h")
              }
            >
              Save
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Brand Color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-10 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
            />
            <span className="text-xs text-muted-foreground font-mono">
              {accentColor}
            </span>
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground block mb-2">
            Logo Upload
          </Label>
          <button
            type="button"
            className="w-full border-2 border-dashed border-white/15 rounded-lg p-3 text-center hover:border-primary/40 cursor-pointer transition-colors"
            onClick={() => toast.info("Upload brand logo (SVG or PNG)")}
            data-ocid="admin.whitelabel.upload_button"
          >
            <p className="text-xs text-muted-foreground">Drop logo here</p>
          </button>
        </div>
        <Button
          size="sm"
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs h-8"
          onClick={() => toast.success("White-label config saved!")}
          data-ocid="admin.whitelabel.save_button"
        >
          Apply White-label Config
        </Button>
      </div>
    </Section>
  );
}

function BannerManager() {
  const [banners, setBanners] = useState([
    { id: 1, text: "New AI features now live 🚀", type: "info", active: true },
    {
      id: 2,
      text: "Scheduled maintenance Sunday 2AM",
      type: "warning",
      active: false,
    },
  ]);
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState("info");

  const typeStyle = (t: string) =>
    t === "info"
      ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
      : t === "warning"
        ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/30"
        : "bg-green-500/15 text-green-300 border-green-500/30";

  return (
    <Section
      title="Banner Manager"
      icon={<Bell className="w-3.5 h-3.5 text-cyan-400" />}
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Banner message…"
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-8"
            data-ocid="admin.banner.input"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="sale">Sale</option>
          </select>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-8 px-3"
            onClick={() => {
              if (newText.trim()) {
                setBanners([
                  ...banners,
                  {
                    id: Date.now(),
                    text: newText,
                    type: newType,
                    active: true,
                  },
                ]);
                setNewText("");
                toast.success("Banner created!");
              }
            }}
            data-ocid="admin.banner.save_button"
          >
            +
          </Button>
        </div>
        {banners.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/8"
          >
            <span
              className={`text-[10px] px-2 py-0.5 rounded border flex-shrink-0 ${typeStyle(b.type)}`}
            >
              {b.type}
            </span>
            <p className="text-xs text-white flex-1 truncate">{b.text}</p>
            <Switch
              checked={b.active}
              onCheckedChange={(v) => {
                setBanners(
                  banners.map((x) => (x.id === b.id ? { ...x, active: v } : x)),
                );
                toast.success(v ? "Banner activated" : "Banner hidden");
              }}
              className="scale-75"
            />
            <button
              type="button"
              onClick={() => setBanners(banners.filter((x) => x.id !== b.id))}
              className="text-red-400 hover:text-red-300 text-xs flex-shrink-0"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function OnboardingFunnel() {
  const steps = [
    { label: "Signup", users: 4821, drop: 0 },
    { label: "Profile Created", users: 3914, drop: 19 },
    { label: "First Upload", users: 2341, drop: 40 },
    { label: "First Clip", users: 1876, drop: 20 },
    { label: "First Share", users: 892, drop: 52 },
  ];
  const max = steps[0].users;
  return (
    <Section
      title="Onboarding Funnel"
      icon={<Target className="w-3.5 h-3.5 text-pink-400" />}
    >
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={s.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white font-medium">{s.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white font-bold">
                  {s.users.toLocaleString()}
                </span>
                {i > 0 && (
                  <span className="text-xs text-red-400">↓{s.drop}%</span>
                )}
              </div>
            </div>
            <div className="h-3 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(s.users / max) * 100}%`,
                  background: `oklch(${0.7 - i * 0.1} 0.15 200)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function AdminAdvancedTabs() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-primary" />
        <h2 className="text-white font-bold text-base">
          Advanced Admin Controls
        </h2>
        <Badge className="bg-yellow-500/15 text-yellow-300 border-yellow-500/30 text-[10px]">
          NEW
        </Badge>
      </div>
      <ResourceMonitor />
      <FeatureToggles />
      <UsageHeatmap />
      <ChurnPredictor />
      <DiscountEngine />
      <APIUsageTracker />
      <ExportQueue />
      <StorageAuditor />
      <ReferralDashboard />
      <FeedbackLoop />
      <SystemStatus />
      <MultiTenant />
      <AuditLogs />
      <RefundTool />
      <DatabaseHealth />
      <LanguageManager />
      <UserSegmentation />
      <StorageQuotaAlerts />
      <WhiteLabelSettings />
      <BannerManager />
      <OnboardingFunnel />
    </div>
  );
}

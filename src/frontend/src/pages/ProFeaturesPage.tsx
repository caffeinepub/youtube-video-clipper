import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  BarChart2,
  CheckCircle2,
  Crown,
  Globe,
  Lock,
  MessageCircle,
  Type,
  Unlock,
  Upload,
  Users,
  Video,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const FREE_FEATURES = [
  "720p / 1080p export",
  "10 min max upload",
  "With watermark",
  "Basic templates",
  "5 clips/day",
];
const PRO_FEATURES = [
  "4K export",
  "2-hour uploads",
  "No watermark",
  "All templates + custom",
  "Unlimited clips",
  "Team folders",
  "Custom domain links",
  "Priority support",
  "Early AI access",
  "Analytics dashboard",
];

export default function ProFeaturesPage() {
  const [noWatermark, setNoWatermark] = useState(false);
  const [earlyAccess, setEarlyAccess] = useState(false);
  const [domainInput, setDomainInput] = useState("clips.yourbrand.com");
  const isPro = false;

  const upgrade = () => toast.success("Redirecting to upgrade page...");
  const locked = () => toast.error("Upgrade to Pro to unlock this feature");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500/25 to-yellow-500/8 border border-yellow-500/30 flex items-center justify-center">
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h1
            className="font-display font-black text-2xl md:text-3xl tracking-tight"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Pro Features
          </h1>
          <p className="text-muted-foreground text-sm">
            Unlock the full Beast Clipping experience
          </p>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="font-bold text-sm">Free</span>
          </div>
          <ul className="space-y-1.5">
            {FREE_FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <p className="text-xl font-black">
            $0
            <span className="text-sm font-normal text-muted-foreground">
              /mo
            </span>
          </p>
        </div>
        <div className="cyber-card p-5 space-y-3 relative overflow-hidden">
          <div className="absolute top-2 right-2 text-[10px] bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded-full font-bold">
            RECOMMENDED
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-yellow-400/15 flex items-center justify-center">
              <Crown className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="font-bold text-sm text-yellow-400">Pro</span>
          </div>
          <ul className="space-y-1.5">
            {PRO_FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-xs text-foreground"
              >
                <CheckCircle2 className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <p className="text-xl font-black text-yellow-400">
            $12
            <span className="text-sm font-normal text-muted-foreground text-foreground">
              /mo
            </span>
          </p>
          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
            onClick={upgrade}
          >
            Upgrade Now
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="glass-card p-5 space-y-3 opacity-60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-bold text-sm">4K Exporting</h3>
            </div>
            <Lock className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-muted-foreground text-xs">
            Free users export up to 1080p. Unlock 4K for cinema-quality clips.
          </p>
          <Button
            size="sm"
            className="w-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
            onClick={locked}
          >
            Unlock with Pro
          </Button>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Custom Fonts</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Upload your own .ttf or .otf font files
          </p>
          <button
            type="button"
            className="border-2 border-dashed border-white/15 rounded-lg p-4 text-center hover:border-primary/30 transition-colors cursor-pointer w-full"
            onClick={() => (isPro ? toast.success("Font uploaded!") : locked())}
          >
            <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">
              Drop .ttf / .otf file here
            </p>
          </button>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">No Watermark</h3>
            </div>
            <Switch
              checked={noWatermark}
              onCheckedChange={(v) => {
                if (isPro) setNoWatermark(v);
                else locked();
              }}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Remove the Beast Clipping watermark from all exports
          </p>
          <div className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/8">
            <div className="flex-1 text-xs text-muted-foreground">
              Watermark status
            </div>
            <span
              className={`text-xs font-bold ${noWatermark ? "text-green-400" : "text-yellow-400"}`}
            >
              {noWatermark ? "Removed" : "Visible"}
            </span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Team Folders</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Share clips and assets across your whole company
          </p>
          <div className="space-y-1.5">
            {["Marketing Team", "Editors", "Shared Assets"].map((folder) => (
              <div
                key={folder}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-xs"
              >
                <span className="text-primary">📁</span>
                {folder}
                <span className="ml-auto text-muted-foreground">
                  {Math.floor(Math.random() * 20) + 1} clips
                </span>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => toast.success("New folder created!")}
          >
            + New Folder
          </Button>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Custom Domain Links</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Share clips at your own branded URL
          </p>
          <div className="flex gap-2">
            <input
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Custom domain configured!")}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">Early Access</h3>
            </div>
            <Switch checked={earlyAccess} onCheckedChange={setEarlyAccess} />
          </div>
          <p className="text-muted-foreground text-xs">
            Be first to try new AI models and features
          </p>
          <div className="space-y-1.5">
            {[
              "GPT-5 captions (beta)",
              "Real-time reframing",
              "Voice cloning (soon)",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Priority Support</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Skip the queue — Pro users get same-day responses
          </p>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-green-400 font-medium">
              Average response time: ~2 hours
            </p>
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => toast.success("Support chat opened!")}
          >
            Open Support Chat
          </Button>
        </div>

        <div className="glass-card p-5 space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Analytics Dashboard</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            See views, likes, and performance data directly in the app
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              ["Views", "14.2K"],
              ["Likes", "892"],
              ["Shares", "341"],
              ["CTR", "6.1%"],
            ].map(([l, v]) => (
              <div key={l as string} className="glass-card p-3 text-center">
                <p className="text-lg font-black text-primary">{v}</p>
                <p className="text-[10px] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

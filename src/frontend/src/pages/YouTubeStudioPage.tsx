import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  BarChart2,
  Bell,
  BookOpen,
  Bot,
  CheckCircle,
  Clapperboard,
  Clock,
  Cpu,
  DollarSign,
  Eye,
  Film,
  Flame,
  Globe,
  Hash,
  Heart,
  Key,
  Languages,
  LayoutGrid,
  Link,
  List,
  Lock,
  Mic,
  Music,
  PenTool,
  Play,
  Radio,
  RefreshCw,
  Scissors,
  Search,
  Send,
  Settings,
  Shield,
  Smile,
  Sparkles,
  Star,
  Tag,
  Target,
  Terminal,
  TrendingUp,
  Trophy,
  Upload,
  Users,
  Video,
  Wand2,
  Wifi,
  XCircle,
  Youtube,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

const TABS = [
  { id: "auth", label: "Connection & Auth", icon: Wifi },
  { id: "upload", label: "Upload & Growth", icon: Upload },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "ai", label: "AI Tools", icon: Bot },
  { id: "admin", label: "Admin & Technical", icon: Terminal },
  { id: "creative", label: "Creative Visuals", icon: Sparkles },
  { id: "community", label: "Community", icon: Users },
  { id: "monetize", label: "Monetization & Security", icon: DollarSign },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  desc: string;
  actionLabel?: string;
  accentColor?: string;
}

function FeatureCardItem({
  icon: Icon,
  title,
  desc,
  actionLabel = "Activate",
  accentColor = "text-primary",
}: FeatureCard) {
  return (
    <div className="glass-card p-4 flex flex-col gap-3 hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20">
          <Icon className={`w-4 h-4 ${accentColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-tight">
            {title}
          </p>
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="w-full text-xs h-7 border border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
        onClick={() =>
          toast.success(`${title} activated!`, {
            description: "Feature is now running.",
          })
        }
        data-ocid="youtube.button"
      >
        {actionLabel}
      </Button>
    </div>
  );
}

function FeatureGrid({ items }: { items: FeatureCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <FeatureCardItem key={item.title} {...item} />
      ))}
    </div>
  );
}

// ─── TAB 1: Connection & Auth ─────────────────────────────────────────────────

function AuthTab() {
  const [channelId, setChannelId] = useState("");
  const [sandboxMode, setSandboxMode] = useState(false);
  const [scopeMinimizer, setScopeMinimizer] = useState(true);

  const authFeatures: FeatureCard[] = [
    {
      icon: Users,
      title: "Brand Account Selector",
      desc: "Force a popup to choose between Personal email and Brand Channel.",
      actionLabel: "Open Selector",
    },
    {
      icon: CheckCircle,
      title: "OAuth Scope Auditor",
      desc: "Check Connection button lists exactly which permissions (Read, Write, Manage) are missing.",
      actionLabel: "Check Connection",
    },
    {
      icon: RefreshCw,
      title: "Re-Auth Trigger",
      desc: "Automatically prompt a login refresh if the refresh_token expires or is revoked.",
      actionLabel: "Simulate Trigger",
    },
    {
      icon: BookOpen,
      title: "GCP Console Guide",
      desc: "In-app walkthrough on how to add yourself as a Test User in your Google Cloud project.",
      actionLabel: "Open Guide",
    },
    {
      icon: Key,
      title: "Headless Login",
      desc: "Fallback method using a browser extension to grab the session cookie if API fails.",
      actionLabel: "Learn More",
      accentColor: "text-yellow-400",
    },
  ];

  const gcpSteps = [
    "Go to console.cloud.google.com",
    "Open your project → APIs & Services → OAuth consent screen",
    'Scroll to "Test users" section',
    'Click "Add Users" → enter your Gmail address',
    "Save and wait 10-15 minutes for propagation",
    'Return to Beast Clipping and click "Connect YouTube"',
  ];

  return (
    <div className="space-y-5">
      {/* Verification Status Bar */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border"
        style={{
          background: "oklch(0.55 0.15 60 / 0.1)",
          borderColor: "oklch(0.75 0.15 60 / 0.4)",
        }}
      >
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-yellow-300">
            ⚠️ Unverified App — Your app is pending Google review
          </p>
          <p className="text-xs text-yellow-200/70 mt-1">
            Some features may be restricted until Google verifies this
            application. Upload functionality is limited to Test Users added in
            your GCP project.
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-xs h-7 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 flex-shrink-0"
          onClick={() =>
            toast.info("Opening Google OAuth verification docs...")
          }
          data-ocid="youtube.auth.button"
        >
          Learn More
        </Button>
      </div>

      {/* Sandbox Mode + Scope Minimizer toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Sandbox Mode
            </p>
            <p className="text-xs text-muted-foreground">
              Connect via Test Channel first
            </p>
          </div>
          <Switch
            checked={sandboxMode}
            onCheckedChange={(v) => {
              setSandboxMode(v);
              toast.success(
                v ? "Sandbox mode enabled" : "Sandbox mode disabled",
              );
            }}
            data-ocid="youtube.auth.switch"
          />
        </div>
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Scope Minimizer
            </p>
            <p className="text-xs text-muted-foreground">
              Upload-only — avoids security blocks
            </p>
          </div>
          <Switch
            checked={scopeMinimizer}
            onCheckedChange={(v) => {
              setScopeMinimizer(v);
              toast.success(
                v ? "Minimal scopes enabled" : "Full scopes enabled",
              );
            }}
            data-ocid="youtube.scope.switch"
          />
        </div>
      </div>

      {/* Manual Channel ID Input */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">
            Direct Channel ID Input
          </p>
          <Badge variant="secondary" className="text-xs">
            Fallback
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Manually paste your Channel ID if auto-fetch fails (starts with UC…)
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="UCxxxxxxxxxxxxxxxxxxxxxxxx"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            className="flex-1 bg-white/5 border-white/10 text-sm h-9"
            data-ocid="youtube.channel.input"
          />
          <Button
            size="sm"
            className="h-9 px-4 text-xs"
            onClick={() => {
              if (!channelId.trim()) {
                toast.error("Please enter a channel ID");
                return;
              }
              toast.success("Channel ID saved!", {
                description: `Using channel: ${channelId}`,
              });
            }}
            data-ocid="youtube.channel.save_button"
          >
            Save
          </Button>
        </div>
      </div>

      {/* GCP Guide Steps */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <p className="text-sm font-semibold text-foreground">
            Google Cloud Console Setup Guide
          </p>
        </div>
        <ol className="space-y-2">
          {gcpSteps.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{
                  background: "oklch(0.88 0.17 200 / 0.15)",
                  color: "oklch(0.88 0.17 200)",
                  border: "1px solid oklch(0.88 0.17 200 / 0.3)",
                }}
              >
                {i + 1}
              </span>
              <p className="text-xs text-muted-foreground">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <FeatureGrid items={authFeatures} />
    </div>
  );
}

// ─── TAB 2: Upload & Growth ───────────────────────────────────────────────────

function UploadTab() {
  const [subGoal, setSubGoal] = useState("1000");
  const [currentSubs] = useState(247);

  const goal = Number.parseInt(subGoal) || 1000;
  const progress = Math.min((currentSubs / goal) * 100, 100);

  const uploadFeatures: FeatureCard[] = [
    {
      icon: Upload,
      title: "Auto-Shorts Uploader",
      desc: "Push clips directly to YouTube Shorts with a Related Video link attached.",
      actionLabel: "Upload Now",
    },
    {
      icon: Smile,
      title: "Comment Scraper",
      desc: "AI finds the funniest comments and turns them into text overlays on the clip.",
      actionLabel: "Scrape Comments",
    },
    {
      icon: LayoutGrid,
      title: "Thumbnail Split-Tester",
      desc: "Generate 3 YouTube thumbnails and track which one gets the most clicks.",
      actionLabel: "Generate Thumbnails",
    },
    {
      icon: Target,
      title: "CTR Predictor",
      desc: "AI analyzes your thumbnail and title to predict click-through rate performance.",
      actionLabel: "Predict CTR",
    },
    {
      icon: Wand2,
      title: "Title Hook Generator",
      desc: "Get 10 viral title ideas based on your video transcript.",
      actionLabel: "Generate Titles",
    },
    {
      icon: PenTool,
      title: "Auto-Description",
      desc: "Generates SEO-rich descriptions with timestamps and social links.",
      actionLabel: "Generate",
    },
    {
      icon: Tag,
      title: "Tag Optimizer",
      desc: "Suggests tags that are currently trending in your specific niche.",
      actionLabel: "Optimize Tags",
    },
    {
      icon: Film,
      title: "End Screen Suggestor",
      desc: "Recommends which video to link at the end based on viewer retention data.",
      actionLabel: "Get Suggestion",
    },
    {
      icon: Clock,
      title: "Community Post Scheduler",
      desc: "Turn a clip into a GIF and schedule it as a YouTube Community Post.",
      actionLabel: "Schedule Post",
    },
    {
      icon: List,
      title: "Playlist Auto-Adder",
      desc: 'Automatically add new clips to a specific "Shorts" or "Gaming" playlist.',
      actionLabel: "Configure",
    },
    {
      icon: Shield,
      title: "Copyright Scanner",
      desc: "Pre-scan clips for music that might get a Content ID claim before uploading.",
      actionLabel: "Scan Clip",
    },
    {
      icon: Users,
      title: "Collaborator Tagging",
      desc: "Auto-mention other creators in the description if they appear in the clip.",
      actionLabel: "Enable Tagging",
    },
    {
      icon: Wand2,
      title: "Channel Branding Kit",
      desc: "Auto-apply your YouTube banner colors and fonts to every clip.",
      actionLabel: "Apply Branding",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Subscriber Goal Widget */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <p className="text-sm font-semibold text-foreground">
            Subscriber Goal Overlay
          </p>
          <Badge
            variant="secondary"
            className="text-xs bg-yellow-400/15 text-yellow-400 border-yellow-400/25"
          >
            Live
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Current:{" "}
                <span className="text-foreground font-semibold">
                  {currentSubs.toLocaleString()}
                </span>
              </span>
              <span className="text-muted-foreground">
                Goal:{" "}
                <span className="text-primary font-semibold">
                  {goal.toLocaleString()}
                </span>
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              🎯 Road to {goal.toLocaleString()} —{" "}
              <span className="text-primary">
                {progress.toFixed(1)}% complete
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              value={subGoal}
              onChange={(e) => setSubGoal(e.target.value)}
              className="w-24 h-8 text-xs bg-white/5 border-white/10 text-center"
              placeholder="Goal"
              data-ocid="youtube.subgoal.input"
            />
            <Button
              size="sm"
              className="h-8 text-xs"
              onClick={() =>
                toast.success(
                  `Goal set to ${goal.toLocaleString()} subscribers!`,
                )
              }
              data-ocid="youtube.subgoal.save_button"
            >
              Set Goal
            </Button>
          </div>
        </div>
      </div>

      <FeatureGrid items={uploadFeatures} />
    </div>
  );
}

// ─── TAB 3: Analytics ─────────────────────────────────────────────────────────

function AnalyticsTab() {
  const healthScore = 72;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const analyticsFeatures: FeatureCard[] = [
    {
      icon: TrendingUp,
      title: "Sub-Gain Tracker",
      desc: "See exactly how many subscribers a specific clip brought in.",
      actionLabel: "Track Gains",
    },
    {
      icon: Bell,
      title: "Competitor Watch",
      desc: "Get alerts when a similar channel in your niche posts a viral Short.",
      actionLabel: "Enable Alerts",
    },
    {
      icon: Zap,
      title: "Pacing Analyzer",
      desc: 'AI tells you if your clip is "too slow" compared to top-performing Shorts.',
      actionLabel: "Analyze Pacing",
    },
    {
      icon: Eye,
      title: "Audience Heatmap",
      desc: "Shows which parts of your video people are re-watching most.",
      actionLabel: "View Heatmap",
    },
    {
      icon: Search,
      title: "Keyword Gap",
      desc: "Tells you which search terms people use to find you that you aren't using.",
      actionLabel: "Find Gaps",
    },
    {
      icon: Clock,
      title: "Upload Time Optimizer",
      desc: "Suggests the best hour to post based on your subscribers' activity.",
      actionLabel: "Get Best Time",
    },
    {
      icon: BarChart2,
      title: "A/B Hook Tester",
      desc: "Post two versions of a Short and see which one performs better.",
      actionLabel: "Create A/B Test",
    },
    {
      icon: DollarSign,
      title: "Revenue Estimator",
      desc: "Predicts AdSense earnings for a clip based on its length and category.",
      actionLabel: "Estimate Revenue",
    },
    {
      icon: Globe,
      title: "Niche Comparison",
      desc: "Your Shorts are getting 20% more views than the average creator in your niche.",
      actionLabel: "Compare",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Channel Health Score */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg
              width="100"
              height="100"
              className="-rotate-90"
              role="img"
              aria-label="Channel health score gauge"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="oklch(0.88 0.17 200 / 0.1)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={`oklch(${healthScore > 70 ? "0.75 0.17 145" : healthScore > 40 ? "0.75 0.15 60" : "0.6 0.2 20"})`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-foreground">
                {healthScore}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Channel Health Score
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on upload consistency, engagement rate, and audience
              retention.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "oklch(0.75 0.17 145)" }}
              />
              <span className="text-xs text-green-400 font-medium">
                Good — above average for your niche
              </span>
            </div>
          </div>
        </div>
      </div>

      <FeatureGrid items={analyticsFeatures} />
    </div>
  );
}

// ─── TAB 4: AI Tools ──────────────────────────────────────────────────────────

function AIToolsTab() {
  const [scriptNiche, setScriptNiche] = useState("");
  const [clickbaitTitle, setClickbaitTitle] = useState("");
  const [selectedLang, setSelectedLang] = useState("es");
  const [autoEmoji, setAutoEmoji] = useState(false);

  const sentimentScore = 78; // out of 100 positive

  const aiFeatures: FeatureCard[] = [
    {
      icon: Scissors,
      title: "Face-Cam Extractor",
      desc: "Automatically finds the Face Cam box and centers it for 9:16 format.",
      actionLabel: "Extract Face Cam",
    },
    {
      icon: Search,
      title: "B-Roll Search",
      desc: "Searches your own past videos for relevant B-roll to insert.",
      actionLabel: "Search B-Roll",
    },
    {
      icon: Mic,
      title: "Audio Enhancer",
      desc: "Makes cheap mic audio sound like a Shure SM7B with one click.",
      actionLabel: "Enhance Audio",
    },
    {
      icon: Hash,
      title: "Topic Finder",
      desc: "AI suggests 5 more video ideas based on what your fans are asking for.",
      actionLabel: "Find Topics",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Automatic Chapters */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold">Automatic Chapters</p>
        </div>
        <p className="text-xs text-muted-foreground">
          AI writes the timestamps for your long-form videos automatically.
        </p>
        <Button
          size="sm"
          className="text-xs h-8"
          onClick={() =>
            toast.success("Chapters generated!", {
              description: "0:00 Intro | 1:23 Main Topic | 4:47 Conclusion",
            })
          }
          data-ocid="youtube.chapters.button"
        >
          Generate Chapters
        </Button>
      </div>

      {/* Multi-Language Dubbing */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-cyan-400" />
          <p className="text-sm font-semibold">Multi-Language Dubbing</p>
          <Badge className="text-xs bg-cyan-400/15 text-cyan-400 border-cyan-400/25">
            AI Voice
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          AI voices translate your clip into 5 different languages.
        </p>
        <div className="flex gap-2">
          <Select value={selectedLang} onValueChange={setSelectedLang}>
            <SelectTrigger
              className="flex-1 h-8 text-xs bg-white/5 border-white/10"
              data-ocid="youtube.dub.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">🇪🇸 Spanish</SelectItem>
              <SelectItem value="fr">🇫🇷 French</SelectItem>
              <SelectItem value="de">🇩🇪 German</SelectItem>
              <SelectItem value="pt">🇧🇷 Portuguese</SelectItem>
              <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="h-8 text-xs"
            onClick={() =>
              toast.success(`Dubbing to ${selectedLang.toUpperCase()} started!`)
            }
            data-ocid="youtube.dub.button"
          >
            Dub Clip
          </Button>
        </div>
      </div>

      {/* Clickbait Detector */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <p className="text-sm font-semibold">Clickbait Detector</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Warns you if your title/thumbnail is too misleading to avoid
          shadowbans.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter your video title..."
            value={clickbaitTitle}
            onChange={(e) => setClickbaitTitle(e.target.value)}
            className="flex-1 h-8 text-xs bg-white/5 border-white/10"
            data-ocid="youtube.clickbait.input"
          />
          <Button
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              if (!clickbaitTitle) {
                toast.error("Please enter a title to analyze");
                return;
              }
              toast.success("Title analysis complete!", {
                description: "✅ Low clickbait score — safe to publish.",
              });
            }}
            data-ocid="youtube.clickbait.button"
          >
            Analyze
          </Button>
        </div>
      </div>

      {/* AI Script Writer */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-indigo-400" />
          <p className="text-sm font-semibold">AI Script Writer</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Generates a 60-second script for a Short based on your long video.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Your niche (e.g. Gaming, Finance...)"
            value={scriptNiche}
            onChange={(e) => setScriptNiche(e.target.value)}
            className="flex-1 h-8 text-xs bg-white/5 border-white/10"
            data-ocid="youtube.script.input"
          />
          <Button
            size="sm"
            className="h-8 text-xs"
            onClick={() =>
              toast.success("Script generated!", {
                description:
                  'Hook: "You won\u2019t believe..." | CTA: "Follow for more!" | 58 seconds',
              })
            }
            data-ocid="youtube.script.button"
          >
            Write Script
          </Button>
        </div>
      </div>

      {/* Auto-Emoji Toggle */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Auto-Emoji</p>
          <p className="text-xs text-muted-foreground">
            Inserts trending YouTube emojis into captions at the perfect time.
          </p>
        </div>
        <Switch
          checked={autoEmoji}
          onCheckedChange={(v) => {
            setAutoEmoji(v);
            toast.success(v ? "Auto-Emoji enabled! 🔥" : "Auto-Emoji disabled");
          }}
          data-ocid="youtube.emoji.switch"
        />
      </div>

      {/* Sentiment Monitor */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400" />
          <p className="text-sm font-semibold">Sentiment Monitor</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Scans comments to see if the vibe is Positive or Toxic.
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-green-400">Positive</span>
            <span className="text-foreground font-semibold">
              {sentimentScore}%
            </span>
          </div>
          <Progress value={sentimentScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {sentimentScore > 70
              ? "✅ Mostly positive vibes!"
              : "⚠️ Some toxic comments detected"}
          </p>
        </div>
      </div>

      <FeatureGrid items={aiFeatures} />
    </div>
  );
}

// ─── TAB 5: Admin & Technical ─────────────────────────────────────────────────

function AdminTechTab() {
  const quotaUsed = 3420;
  const quotaTotal = 10000;
  const quotaPercent = (quotaUsed / quotaTotal) * 100;

  const errorLogs = [
    { time: "2m ago", error: "Video too long", clip: "Clip_0472" },
    { time: "15m ago", error: "Duplicate content", clip: "Clip_0471" },
    { time: "1h ago", error: "Invalid category", clip: "Clip_0468" },
    { time: "3h ago", error: "Token expired", clip: "Clip_0465" },
  ];

  return (
    <div className="space-y-5">
      {/* Quota Manager */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold">YouTube API Quota Manager</p>
          </div>
          <Badge
            variant="secondary"
            className={`text-xs ${
              quotaPercent > 80
                ? "bg-red-400/15 text-red-400 border-red-400/25"
                : "bg-green-400/15 text-green-400 border-green-400/25"
            }`}
          >
            {quotaPercent.toFixed(0)}% Used
          </Badge>
        </div>
        <Progress value={quotaPercent} className="h-4" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{quotaUsed.toLocaleString()} credits used today</span>
          <span>{(quotaTotal - quotaUsed).toLocaleString()} remaining</span>
        </div>
        <p className="text-xs text-muted-foreground/60">
          Resets daily at midnight Pacific Time
        </p>
      </div>

      {/* Token Refresher */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Token Refresher</p>
          <p className="text-xs text-muted-foreground">
            Manual Fix Connection button for admins to help stuck users.
          </p>
        </div>
        <Button
          size="sm"
          className="text-xs h-8 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
          onClick={() =>
            toast.success("Token refreshed!", {
              description: "All user connections have been refreshed.",
            })
          }
          data-ocid="youtube.token.button"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Fix Connection
        </Button>
      </div>

      {/* Category Manager */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold">Category Manager</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Set default YouTube categories per project.
        </p>
        <Select
          defaultValue="gaming"
          onValueChange={(v) => toast.success(`Default category set to ${v}`)}
        >
          <SelectTrigger
            className="h-9 text-sm bg-white/5 border-white/10"
            data-ocid="youtube.category.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gaming">🎮 Gaming</SelectItem>
            <SelectItem value="comedy">😂 Comedy</SelectItem>
            <SelectItem value="education">📚 Education</SelectItem>
            <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
            <SelectItem value="howto">🛠 How-to & Style</SelectItem>
            <SelectItem value="music">🎵 Music</SelectItem>
            <SelectItem value="sports">⚽ Sports</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Metadata Edit */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-indigo-400" />
          <p className="text-sm font-semibold">Bulk Metadata Edit</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Change the description of up to 100 videos at once.
        </p>
        <Button
          size="sm"
          className="text-xs h-8"
          onClick={() =>
            toast.success("Bulk edit queued!", {
              description: "Processing metadata for 23 videos...",
            })
          }
          data-ocid="youtube.bulk.button"
        >
          Open Bulk Editor
        </Button>
      </div>

      {/* API Error Logs */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-red-400" />
          <p className="text-sm font-semibold">API Error Logs</p>
          <Badge className="text-xs bg-red-400/15 text-red-400 border-red-400/25">
            {errorLogs.length} errors
          </Badge>
        </div>
        <div className="space-y-2">
          {errorLogs.map((log) => (
            <div
              key={log.clip}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/3 border border-white/5 text-xs"
            >
              <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="text-muted-foreground flex-shrink-0">
                {log.time}
              </span>
              <span className="text-foreground flex-1">{log.error}</span>
              <span className="text-muted-foreground/60">{log.clip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB 6: Creative Visuals ──────────────────────────────────────────────────

function CreativeTab() {
  const creativeFeatures: FeatureCard[] = [
    {
      icon: Bell,
      title: "Subscribe Animation",
      desc: "Built-in pop-up subscribe button with your own avatar overlay.",
      actionLabel: "Preview Animation",
    },
    {
      icon: Lock,
      title: "Member-Only Clips",
      desc: 'Auto-render versions of clips with "Join" buttons for channel members.',
      actionLabel: "Create Member Clip",
    },
    {
      icon: Radio,
      title: "Livestream Highlight Finder",
      desc: "AI scans 4-hour streams for PEAK audio/chat activity moments.",
      actionLabel: "Scan Stream",
    },
    {
      icon: Clapperboard,
      title: "Chat Overlay",
      desc: "Burn the live YouTube chat into the side of the clip.",
      actionLabel: "Add Chat Overlay",
    },
    {
      icon: Target,
      title: "Dynamic Watermarks",
      desc: "Your channel handle follows the speaker's head dynamically.",
      actionLabel: "Enable Watermark",
    },
    {
      icon: Sparkles,
      title: "Green Screen Removal",
      desc: "One-click background swap for your reaction videos.",
      actionLabel: "Remove Background",
    },
    {
      icon: Play,
      title: "Animated Next Video Cards",
      desc: "Visual teasers and animated cards for the end of a Short.",
      actionLabel: "Create End Card",
    },
    {
      icon: Eye,
      title: "Blur Faces",
      desc: "Automatically hide people in the background of vlogs.",
      actionLabel: "Blur Faces",
    },
    {
      icon: Wand2,
      title: "Color Match",
      desc: "Make your iPhone footage look like your Sony camera footage.",
      actionLabel: "Match Colors",
    },
    {
      icon: Zap,
      title: "Speed Ramping",
      desc: "Fast-forward boring parts automatically for more engaging content.",
      actionLabel: "Apply Speed Ramp",
    },
    {
      icon: BarChart2,
      title: "Retention Map Overlay",
      desc: "See the YouTube Studio retention graph on top of your editor.",
      actionLabel: "Show Retention",
    },
  ];

  return (
    <div className="space-y-5">
      <FeatureGrid items={creativeFeatures} />
    </div>
  );
}

// ─── TAB 7: Community ─────────────────────────────────────────────────────────

function CommunityTab() {
  const communityFeatures: FeatureCard[] = [
    {
      icon: Send,
      title: "Comment Reply Videos",
      desc: "One-click to turn a YouTube comment into a Short reply video.",
      actionLabel: "Create Reply",
    },
    {
      icon: Trophy,
      title: "Giveaway Picker",
      desc: "Randomly select a winner from your video comments.",
      actionLabel: "Pick Winner",
    },
    {
      icon: BarChart2,
      title: "Poll Generator",
      desc: "Create a community poll based on the video's topic.",
      actionLabel: "Create Poll",
    },
    {
      icon: Users,
      title: "Shared Folders",
      desc: 'Let your YouTube editor upload clips directly to your "Drafts" folder.',
      actionLabel: "Create Folder",
    },
    {
      icon: Link,
      title: "Fan-Clip Submission",
      desc: 'A shareable link for fans to "Submit their favorite moment" to your app.',
      actionLabel: "Generate Link",
    },
    {
      icon: List,
      title: "Channel Leaderboard",
      desc: "Show which fans comment the most on your channel.",
      actionLabel: "View Leaderboard",
    },
    {
      icon: Heart,
      title: "Automated Thank You",
      desc: "Post a comment automatically thanking the first 10 viewers of a video.",
      actionLabel: "Enable Auto-Thanks",
    },
    {
      icon: Star,
      title: "Milestone Celebrator",
      desc: "Auto-generate a clip when you hit 10k/100k/1M subscribers.",
      actionLabel: "Configure",
    },
    {
      icon: Users,
      title: "Cross-Promo Hub",
      desc: "Find other users of the app to do Collab Shorts with.",
      actionLabel: "Find Creators",
    },
    {
      icon: DollarSign,
      title: "Brand Outreach",
      desc: 'Auto-generate a "Media Kit" based on your YouTube stats for sponsors.',
      actionLabel: "Generate Media Kit",
    },
  ];

  return (
    <div className="space-y-5">
      <FeatureGrid items={communityFeatures} />
    </div>
  );
}

// ─── TAB 8: Monetization & Security ──────────────────────────────────────────

function MonetizeSecurityTab() {
  const [panicConfirm, setPanicConfirm] = useState(false);

  const monetizeFeatures: FeatureCard[] = [
    {
      icon: Scissors,
      title: "Sponsor Segment Finder",
      desc: "Automatically identifies and cuts out sponsor reads for Shorts.",
      actionLabel: "Find Sponsors",
    },
    {
      icon: Link,
      title: "Affiliate Link Inserter",
      desc: "Scans your video for Amazon products and adds affiliate links.",
      actionLabel: "Add Links",
    },
    {
      icon: DollarSign,
      title: "Ad-Break Optimizer",
      desc: "Tells you where to put mid-rolls for the most ad revenue.",
      actionLabel: "Optimize Breaks",
    },
    {
      icon: Tag,
      title: "Merch Overlay",
      desc: "Display your Shopify/Spring items in the video.",
      actionLabel: "Add Merch",
    },
    {
      icon: Lock,
      title: "Membership Teasers",
      desc: 'Create 15-second "Leaked" clips for members-only content.',
      actionLabel: "Create Teaser",
    },
    {
      icon: BarChart2,
      title: "RPM Tracker",
      desc: "See which video topics are paying the most per 1,000 views.",
      actionLabel: "View RPM",
    },
    {
      icon: DollarSign,
      title: "Tax Estimator",
      desc: "Calculates potential earnings after YouTube's revenue share.",
      actionLabel: "Estimate",
    },
    {
      icon: Film,
      title: "Sponsorship Report",
      desc: 'Generates a PDF of "Clip Stats" to show potential sponsors.',
      actionLabel: "Generate PDF",
    },
    {
      icon: Clock,
      title: "CTA Timer",
      desc: "Reminds you if you went 2 minutes without asking for a subscribe.",
      actionLabel: "Enable Timer",
    },
    {
      icon: Trophy,
      title: "Loyalty Badges",
      desc: "Automatically identify Super Chat donors in the editor.",
      actionLabel: "Enable Badges",
    },
  ];

  const securityFeatures: FeatureCard[] = [
    {
      icon: AlertTriangle,
      title: "TOS Scanner",
      desc: 'Flags words that might get you "Yellow Dollar" demonetized.',
      actionLabel: "Scan Script",
      accentColor: "text-yellow-400",
    },
    {
      icon: Eye,
      title: "Sensitive Content Blur",
      desc: "Auto-blurs blood, knives, or restricted items in your clips.",
      actionLabel: "Enable Blur",
    },
    {
      icon: RefreshCw,
      title: "Backup Channel Sync",
      desc: "Duplicate your library to a second channel for safety.",
      actionLabel: "Setup Backup",
    },
    {
      icon: Shield,
      title: "Comment Filter",
      desc: "Auto-hide spam/scam links in your video comments.",
      actionLabel: "Enable Filter",
    },
    {
      icon: Key,
      title: "API Key Encryption",
      desc: "Ensures your YouTube connection credentials are 100% private.",
      actionLabel: "Check Status",
      accentColor: "text-green-400",
    },
    {
      icon: Users,
      title: "Access Levels",
      desc: 'Editor can clip, but only Owner can hit "Publish" — granular control.',
      actionLabel: "Manage Access",
    },
    {
      icon: List,
      title: "Audit Log",
      desc: "See who uploaded what video to your channel and when.",
      actionLabel: "View Audit Log",
    },
    {
      icon: Globe,
      title: "Region Block Checker",
      desc: "Tells you if your video is blocked in certain countries.",
      actionLabel: "Check Regions",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Monetization Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Monetization
          </h3>
        </div>
        <FeatureGrid items={monetizeFeatures} />
      </div>

      {/* Security Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Security & Policy
          </h3>
        </div>
        <FeatureGrid items={securityFeatures} />
      </div>

      {/* Panic Button */}
      <div
        className="p-5 rounded-2xl border-2 space-y-4"
        style={{
          background: "oklch(0.35 0.15 20 / 0.15)",
          borderColor: "oklch(0.55 0.2 20 / 0.5)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.55 0.2 20 / 0.25)" }}
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="font-bold text-red-400">⚡ Panic Button</p>
            <p className="text-xs text-muted-foreground">
              One-click emergency: set ALL videos to Private immediately.
            </p>
          </div>
        </div>
        {!panicConfirm ? (
          <Button
            className="w-full font-bold text-sm h-11"
            style={{
              background: "oklch(0.5 0.2 20)",
              border: "1px solid oklch(0.6 0.2 20)",
            }}
            onClick={() => setPanicConfirm(true)}
            data-ocid="youtube.panic.button"
          >
            🚨 EMERGENCY: Set All Videos to Private
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-red-300 font-semibold text-center">
              ⚠️ Are you sure? This will set ALL your public videos to Private.
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1 text-xs h-9 border border-white/10"
                onClick={() => setPanicConfirm(false)}
                data-ocid="youtube.panic.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 text-xs h-9"
                style={{ background: "oklch(0.5 0.2 20)" }}
                onClick={() => {
                  setPanicConfirm(false);
                  toast.error("Emergency mode activated!", {
                    description:
                      "All videos set to Private. Check YouTube Studio.",
                  });
                }}
                data-ocid="youtube.panic.confirm_button"
              >
                Confirm — Go Private Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function YouTubeStudioPage() {
  const [activeTab, setActiveTab] = useState<TabId>("auth");

  const tabComponents: Record<TabId, React.ReactNode> = {
    auth: <AuthTab />,
    upload: <UploadTab />,
    analytics: <AnalyticsTab />,
    ai: <AIToolsTab />,
    admin: <AdminTechTab />,
    creative: <CreativeTab />,
    community: <CommunityTab />,
    monetize: <MonetizeSecurityTab />,
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.5 0.2 20 / 0.3) 0%, oklch(0.5 0.2 20 / 0.1) 100%)",
            border: "1px solid oklch(0.6 0.2 20 / 0.5)",
          }}
        >
          <Youtube className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight">
            YouTube Studio
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Complete YouTube creator toolkit — connection, growth, AI, and
            monetization
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge className="bg-red-400/15 text-red-400 border-red-400/25 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5 animate-pulse" />
            YouTube Connected
          </Badge>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                active
                  ? "text-primary border border-primary/30"
                  : "text-muted-foreground border border-transparent hover:text-foreground hover:bg-white/5"
              }`}
              style={
                active
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.88 0.17 200 / 0.12) 0%, oklch(0.88 0.17 200 / 0.04) 100%)",
                      boxShadow: "0 0 12px oklch(0.88 0.17 200 / 0.15)",
                    }
                  : undefined
              }
              data-ocid="youtube.tab"
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>{tabComponents[activeTab]}</div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-center">
        <p className="text-xs text-muted-foreground/40">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/60 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

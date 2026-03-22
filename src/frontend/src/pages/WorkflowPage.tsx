import { Button } from "@/components/ui/button";
import {
  Bell,
  Download,
  FileText,
  GitBranch,
  Link2,
  MessageSquare,
  Palette,
  Pencil,
  QrCode,
  Rss,
  Scissors,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const MOODS = [
  {
    name: "Aggressive",
    color: "from-red-500/30 to-orange-500/20",
    border: "border-red-500/40",
    text: "text-red-400",
    emoji: "🔥",
    desc: "Fast cuts, bold text, high energy music",
  },
  {
    name: "Chill",
    color: "from-cyan-500/30 to-blue-500/20",
    border: "border-cyan-500/40",
    text: "text-cyan-400",
    emoji: "🌊",
    desc: "Slow transitions, soft captions, lo-fi vibes",
  },
  {
    name: "Educational",
    color: "from-green-500/30 to-teal-500/20",
    border: "border-green-500/40",
    text: "text-green-400",
    emoji: "📚",
    desc: "Clean layout, clear captions, lower-thirds",
  },
];

export default function WorkflowPage() {
  const [zapierUrl, setZapierUrl] = useState("");
  const [slackUrl, setSlackUrl] = useState("");
  const [notionUrl, setNotionUrl] = useState("");
  const [rssUrl, setRssUrl] = useState("");
  const [rssFeeds, setRssFeeds] = useState<string[]>([]);
  const [activeMood, setActiveMood] = useState("");
  const [msStart, setMsStart] = useState("0");
  const [msEnd, setMsEnd] = useState("15000");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  const connectZapier = () => {
    if (!zapierUrl) {
      toast.error("Enter webhook URL");
      return;
    }
    toast.success("Zapier connected! Clips will auto-send to Dropbox");
  };
  const testSlack = () => {
    if (!slackUrl) {
      toast.error("Enter Slack webhook URL");
      return;
    }
    toast.success("Slack test notification sent!");
  };
  const subscribeRss = () => {
    if (!rssUrl) {
      toast.error("Enter RSS URL");
      return;
    }
    setRssFeeds((f) => [...f, rssUrl]);
    setRssUrl("");
    toast.success("RSS feed subscribed!");
  };
  const exportCSV = () => {
    const csv =
      'id,title,start,end,transcript\n1,Epic Moment,0,15,"This is the transcript..."\n2,Viral Clip,30,60,"Another clip transcript here"';
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "beast_clipping_transcripts.csv";
    a.click();
    toast.success("CSV exported!");
  };
  const applyBulkEdit = () => {
    if (!findText) {
      toast.error("Enter text to find");
      return;
    }
    toast.success(
      `Replaced "${findText}" with "${replaceText}" across all clips`,
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/25 to-primary/8 border border-primary/30 flex items-center justify-center neon-glow-sm">
          <GitBranch className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight">
            Workflow Tools
          </h1>
          <p className="text-muted-foreground text-sm">
            Deep integrations & productivity features
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Zapier */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Zapier / Make Integration</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Auto-send finished clips to Dropbox, Google Drive, and more
          </p>
          <input
            value={zapierUrl}
            onChange={(e) => setZapierUrl(e.target.value)}
            placeholder="https://hooks.zapier.com/hooks/catch/..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
          />
          <Button
            size="sm"
            className="w-full neon-glow-sm"
            onClick={connectZapier}
          >
            Connect Webhook
          </Button>
        </div>

        {/* Slack */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Slack Notifications</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Get pinged in Slack when a long video finishes rendering
          </p>
          <input
            value={slackUrl}
            onChange={(e) => setSlackUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              variant="outline"
              onClick={testSlack}
            >
              Test Notification
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                if (!slackUrl) {
                  toast.error("Enter Slack URL");
                  return;
                }
                toast.success("Slack notifications enabled!");
              }}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Notion */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Notion Embeds</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Watch and manage clip drafts inside your Notion workspace
          </p>
          <input
            value={notionUrl}
            onChange={(e) => setNotionUrl(e.target.value)}
            placeholder="https://notion.so/your-page..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
          />
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => {
              if (!notionUrl) {
                toast.error("Enter Notion URL");
                return;
              }
              toast.success("Notion embed configured!");
            }}
          >
            Configure Embed
          </Button>
        </div>

        {/* RSS */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Rss className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">RSS Feed Import</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Auto-clip the latest episode from any podcast RSS feed
          </p>
          <div className="flex gap-2">
            <input
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              placeholder="https://feeds.buzzsprout.com/..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
            />
            <Button size="sm" variant="outline" onClick={subscribeRss}>
              Add
            </Button>
          </div>
          {rssFeeds.length > 0 && (
            <div className="space-y-1.5">
              {rssFeeds.map((f, i) => (
                <div
                  key={`feed-${f}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-xs"
                >
                  <Rss className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="truncate flex-1">{f}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setRssFeeds((feeds) => feeds.filter((_, j) => j !== i))
                    }
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* YouTube Comment Scraper */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">YouTube Comment Scraper</h3>
            <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full">
              AI
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            AI finds "viral" timestamps from fan comments
          </p>
          <div className="space-y-2">
            {[
              { ts: "2:34", comment: "THIS PART 💀💀💀", votes: 847 },
              {
                ts: "7:12",
                comment: "Bro said what we were all thinking",
                votes: 523,
              },
              {
                ts: "14:55",
                comment: "THE REACTION AT 14:55 LMAOOO",
                votes: 312,
              },
            ].map((c) => (
              <div
                key={c.ts}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/3 border border-white/8"
              >
                <span className="text-primary font-bold text-xs w-10">
                  {c.ts}
                </span>
                <span className="text-xs flex-1 truncate">{c.comment}</span>
                <span className="text-[10px] text-muted-foreground">
                  👍 {c.votes}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 px-2 text-xs text-primary"
                  onClick={() => toast.success(`Clip set to ${c.ts}`)}
                >
                  Clip
                </Button>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => toast.success("Scraping comments...")}
          >
            Scan Video Comments
          </Button>
        </div>

        {/* Frame Accurate Cutting */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Frame-Accurate Cutting</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Precision timeline down to the millisecond
          </p>
          <div className="h-8 bg-black/30 rounded-lg border border-white/8 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary/30 to-cyan-400/20"
              style={{ marginLeft: "20%", width: "40%" }}
            />
            <div className="absolute inset-0 flex">
              {(
                [
                  "d1",
                  "d2",
                  "d3",
                  "d4",
                  "d5",
                  "d6",
                  "d7",
                  "d8",
                  "d9",
                  "d10",
                  "d11",
                  "d12",
                  "d13",
                  "d14",
                  "d15",
                  "d16",
                  "d17",
                  "d18",
                  "d19",
                  "d20",
                ] as const
              ).map((id) => (
                <div key={id} className="flex-1 border-r border-white/5" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-muted-foreground">Start (ms)</p>
              <input
                value={msStart}
                onChange={(e) => setMsStart(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">End (ms)</p>
              <input
                value={msEnd}
                onChange={(e) => setMsEnd(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => toast.success(`Clip set: ${msStart}ms → ${msEnd}ms`)}
          >
            Apply Cut
          </Button>
        </div>

        {/* Preset Moods */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Preset Moods</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            One-click styling for different content vibes
          </p>
          <div className="grid grid-cols-3 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => {
                  setActiveMood(m.name);
                  toast.success(`${m.name} mood applied!`);
                }}
                className={`rounded-xl p-3 bg-gradient-to-br ${m.color} border ${activeMood === m.name ? m.border : "border-white/10"} flex flex-col items-center gap-1 transition-all hover:scale-105`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span
                  className={`text-xs font-bold ${activeMood === m.name ? m.text : "text-foreground"}`}
                >
                  {m.name}
                </span>
              </button>
            ))}
          </div>
          {activeMood && (
            <p className="text-xs text-muted-foreground">
              {MOODS.find((m) => m.name === activeMood)?.desc}
            </p>
          )}
        </div>

        {/* Mobile QR Transfer */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Mobile QR Transfer</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Scan to instantly move a finished clip to your phone
          </p>
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-white p-2 rounded-xl">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                role="img"
                aria-label="QR code"
              >
                {/* Simple mock QR code */}
                {[
                  [0, 0],
                  [0, 20],
                  [0, 40],
                  [20, 0],
                  [40, 0],
                  [60, 0],
                  [60, 20],
                  [80, 0],
                  [80, 20],
                  [80, 40],
                  [0, 60],
                  [0, 80],
                  [20, 80],
                  [40, 60],
                  [40, 80],
                  [60, 60],
                  [60, 80],
                  [80, 60],
                  [80, 80],
                  [20, 40],
                  [40, 20],
                  [40, 40],
                ].map(([x, y]) => (
                  <rect
                    key={`r-${x}-${y}`}
                    x={x + 2}
                    y={y + 2}
                    width={16}
                    height={16}
                    fill="#000"
                    rx={1}
                  />
                ))}
                <rect
                  x="22"
                  y="22"
                  width="56"
                  height="56"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                />
                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  fill="#000"
                  fontSize="8"
                  fontWeight="bold"
                >
                  SCAN
                </text>
              </svg>
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => toast.success("QR code refreshed!")}
          >
            Generate New Code
          </Button>
        </div>

        {/* Bulk Caption Edit */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Bulk Caption Edit</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Fix a misspelling across all your clips at once
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-muted-foreground">Find</p>
              <input
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="e.g. teh"
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Replace with</p>
              <input
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="e.g. the"
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={applyBulkEdit}
          >
            Apply to All Clips
          </Button>
        </div>

        {/* CSV Export */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">CSV Export</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Download all clip transcripts for blog post repurposing
          </p>
          <div className="p-3 rounded-lg bg-white/3 border border-white/8 font-mono text-[10px] text-muted-foreground">
            id,title,start,end,transcript
            <br />
            1,"Epic Moment",0,15,"..."
            <br />
            2,"Viral Clip",30,60,"..."
          </div>
          <Button size="sm" className="w-full neon-glow-sm" onClick={exportCSV}>
            <Download className="w-3 h-3 mr-1.5" />
            Download CSV
          </Button>
        </div>
      </div>
    </div>
  );
}

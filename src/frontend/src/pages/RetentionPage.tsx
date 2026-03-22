import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Bot,
  Calendar,
  Clock,
  Gift,
  Grid2X2,
  Music,
  Send,
  Star,
  Wand2,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const NICHE_TEMPLATES = [
  { name: "Gaming", icon: "🎮", color: "from-purple-500/20 to-indigo-500/10" },
  { name: "Cooking", icon: "🍳", color: "from-orange-500/20 to-yellow-500/10" },
  { name: "Finance", icon: "💹", color: "from-green-500/20 to-teal-500/10" },
  { name: "Fitness", icon: "💪", color: "from-red-500/20 to-orange-500/10" },
  { name: "Tech", icon: "⚡", color: "from-cyan-500/20 to-blue-500/10" },
  { name: "Travel", icon: "✈️", color: "from-sky-500/20 to-indigo-500/10" },
  {
    name: "Real Estate",
    icon: "🏠",
    color: "from-teal-500/20 to-green-500/10",
  },
  { name: "Coding", icon: "💻", color: "from-violet-500/20 to-purple-500/10" },
];

const MUSIC_SUGGESTIONS = [
  { title: "Neon Nights", bpm: 128, mood: "Hype" },
  { title: "Chill Vibes 2025", bpm: 82, mood: "Chill" },
  { title: "Epic Build", bpm: 140, mood: "Dramatic" },
  { title: "Lo-fi Focus", bpm: 75, mood: "Educational" },
];

const AI_RESPONSES: Record<string, string> = {
  funny:
    "💡 Try adding the 'Bruh' sound effect right at the punchline, then slow down the last 2 seconds to 0.5x speed for maximum comedic effect!",
  viral:
    "🚀 Your first 3 seconds are everything. Use a bold hook text overlay, start mid-action, and aim for 7-15 seconds total length.",
  views:
    "📈 Post Tuesday-Thursday between 6-9pm. Use 3-5 hashtags max. The first comment should be an engaging question to boost interaction.",
  captions:
    "✏️ Bold white text with black stroke, 2-4 words per line, at 60% screen height. Sync each word to your audio for karaoke style.",
  music:
    "🎵 Keep music at -12dB under speech. A bass drop on your key moment will make viewers replay the clip.",
  edit: "🎬 Cut on movement, not silence. Every cut should happen when something moves in frame — it feels natural and keeps momentum.",
  default:
    "🤖 Great question! The best clips have strong hooks in the first 1.5 seconds, concise content under 15 seconds, and a clear emotional peak.",
};

export default function RetentionPage() {
  const [doneSound, setDoneSound] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "Hey! I'm your AI Co-Pilot 🤖 Ask me anything about making your clips better!",
    },
  ]);
  const [surpriseShown, setSurpriseShown] = useState(false);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const q = chatInput.toLowerCase();
    const key =
      Object.keys(AI_RESPONSES).find((k) => q.includes(k)) || "default";
    const answer = AI_RESPONSES[key];
    setChatHistory((h) => [
      ...h,
      { role: "user", text: chatInput },
      { role: "ai", text: answer },
    ]);
    setChatInput("");
  };

  const clipsThisYear = 47;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/25 to-primary/8 border border-primary/30 flex items-center justify-center neon-glow-sm">
          <Wand2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight">
            Magic & Retention
          </h1>
          <p className="text-muted-foreground text-sm">
            Rewards, inspiration, and your AI Co-Pilot
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Feature Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Surprise Clips */}
          <div className="cyber-card p-5 flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/20 flex items-center justify-center text-3xl transition-transform ${surpriseShown ? "scale-125" : ""}`}
              style={{ transition: "transform 0.3s ease" }}
            >
              {surpriseShown ? "🎬" : "🎁"}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Surprise Clip!</h3>
              <p className="text-muted-foreground text-xs">
                AI auto-clipped your last upload. A gift from Beast Clipping! 🔥
              </p>
            </div>
            <Button
              size="sm"
              className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
              onClick={() => {
                setSurpriseShown(true);
                toast.success("Your surprise clip is ready! Check My Clips 🎁");
              }}
            >
              <Gift className="w-4 h-4" />
            </Button>
          </div>

          {/* Year in Review */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">2025 Year in Review</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Clips Made", clipsThisYear],
                ["Total Views", "142K"],
                ["Best Month", "March"],
              ].map(([l, v]) => (
                <div key={l as string} className="glass-card p-3">
                  <p className="text-lg font-black text-primary">{v}</p>
                  <p className="text-[10px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
            <Button
              size="sm"
              className="w-full"
              variant="outline"
              onClick={() =>
                toast.success("Year in Review video generating...")
              }
            >
              Generate Montage
            </Button>
          </div>

          {/* Milestone Rewards */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <h3 className="font-bold text-sm">Milestone Rewards</h3>
            </div>
            {[
              [10, "Unlock Basic Templates"],
              [50, "Unlock Pro Effects"],
              [100, "Free Month Pro"],
              [500, "Creator Badge"],
            ].map(([n, reward]) => {
              const pct = Math.min(
                100,
                Math.round((clipsThisYear / (n as number)) * 100),
              );
              const done = clipsThisYear >= (n as number);
              return (
                <div key={n as number} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span
                      className={
                        done
                          ? "text-green-400 font-bold"
                          : "text-muted-foreground"
                      }
                    >
                      {n} clips — {reward}
                    </span>
                    <span
                      className={
                        done ? "text-green-400 font-bold" : "text-primary"
                      }
                    >
                      {done ? "✓ Done!" : `${clipsThisYear}/${n}`}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Inspiration */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">Daily Inspiration</h3>
            </div>
            <div className="cyber-card p-4 rounded-xl">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                Today's Trending Hook
              </p>
              <p className="font-black text-foreground text-base">
                "I tried this for 7 days and [shocking result]..."
              </p>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] bg-primary/15 text-primary border border-primary/25 px-2 py-0.5 rounded-full">
                  #Gaming
                </span>
                <span className="text-[10px] bg-primary/15 text-primary border border-primary/25 px-2 py-0.5 rounded-full">
                  +24% CTR
                </span>
              </div>
            </div>
            <Button
              size="sm"
              className="w-full"
              variant="outline"
              onClick={() => toast.success("New inspiration loaded!")}
            >
              New Hook
            </Button>
          </div>

          {/* Magic Fix Button */}
          <div className="glass-card p-5 flex items-center gap-4">
            <div>
              <h3 className="font-bold">Magic Fix Button</h3>
              <p className="text-muted-foreground text-xs">
                One-click to fix lighting, sound, and framing
              </p>
            </div>
            <Button
              className="ml-auto neon-glow-sm animate-pulse"
              onClick={() =>
                toast.success("✨ Lighting, sound, and framing auto-fixed!")
              }
            >
              <Wand2 className="w-4 h-4 mr-1.5" />
              Fix It
            </Button>
          </div>

          {/* Niche Templates */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Grid2X2 className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">Niche Templates</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {NICHE_TEMPLATES.map((n) => (
                <button
                  key={n.name}
                  type="button"
                  onClick={() => toast.success(`${n.name} template applied!`)}
                  className={`aspect-square rounded-xl bg-gradient-to-br ${n.color} border border-white/10 hover:border-primary/40 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105`}
                >
                  <span className="text-xl">{n.icon}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {n.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Soundtrack Suggestions */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">Soundtrack Suggestions</h3>
            </div>
            <div className="space-y-2">
              {MUSIC_SUGGESTIONS.map((m) => (
                <div
                  key={m.title}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 border border-white/8 hover:border-primary/30 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toast.success(`Playing: ${m.title}`)}
                    className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors"
                  >
                    <span className="text-primary text-xs">▶</span>
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{m.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {m.bpm} BPM · {m.mood}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-primary h-6 px-2"
                    onClick={() => toast.success(`${m.title} added to clip!`)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Export Estimate + Done Sound */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-xs">Export Estimate</h3>
              </div>
              <p className="text-2xl font-black text-primary">~42s</p>
              <p className="text-xs text-muted-foreground">
                For current clip settings
              </p>
            </div>
            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔔</span>
                  <h3 className="font-bold text-xs">Done Sound</h3>
                </div>
                <Switch checked={doneSound} onCheckedChange={setDoneSound} />
              </div>
              <p className="text-xs text-muted-foreground">
                Play a satisfying sound when renders finish
              </p>
            </div>
          </div>
        </div>

        {/* Right: AI Co-Pilot */}
        <div className="glass-card flex flex-col" style={{ height: 600 }}>
          <div className="flex items-center gap-2 p-4 border-b border-white/8">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">AI Co-Pilot</p>
              <p className="text-[10px] text-green-400">● Online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatHistory.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {m.role === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.role === "user" ? "bg-primary/20 border border-primary/30" : "bg-white/5 border border-white/10"}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/8">
            <p className="text-[10px] text-muted-foreground mb-2">
              Try: "How do I make this funnier?" or "How to go viral?"
            </p>
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask your Co-Pilot..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
              />
              <Button size="sm" onClick={sendChat}>
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

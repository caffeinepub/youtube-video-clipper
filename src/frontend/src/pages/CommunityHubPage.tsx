import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Download,
  Link2,
  MessageSquare,
  Send,
  Trophy,
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface ChatMsg {
  id: number;
  sender: string;
  text: string;
  time: string;
}

const TUTORIALS = [
  { title: "How to go viral in 2025", views: "124K", duration: "8:42" },
  { title: "Best hooks for gaming clips", views: "89K", duration: "5:17" },
  { title: "The perfect clip length formula", views: "67K", duration: "6:33" },
  { title: "Captions that stop the scroll", views: "201K", duration: "4:55" },
  { title: "Audio tips for podcast clips", views: "44K", duration: "9:12" },
  { title: "Thumbnail psychology explained", views: "156K", duration: "7:08" },
];

const CAPTION_STYLES = [
  {
    name: "Neon Pop",
    preview: "EPIC MOMENT",
    style: {
      color: "#00f2ff",
      fontWeight: 900,
      textShadow: "0 0 10px #00f2ff",
    },
  },
  {
    name: "Bold White",
    preview: "EPIC MOMENT",
    style: {
      color: "#fff",
      fontWeight: 900,
      fontSize: "1.1em",
      WebkitTextStroke: "1px black",
    },
  },
  {
    name: "Gradient Pro",
    preview: "EPIC MOMENT",
    style: {
      background: "linear-gradient(135deg,#f59e0b,#ef4444)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 900,
    },
  },
  {
    name: "Minimal Gray",
    preview: "epic moment",
    style: { color: "#94a3b8", fontWeight: 500, fontStyle: "italic" },
  },
];

const CONTESTS = [
  {
    title: "Best Clip of the Month",
    entries: 47,
    prize: "1 month Pro",
    ends: "3 days",
  },
  {
    title: "Most Creative Edit",
    entries: 23,
    prize: "Feature on showcase",
    ends: "6 days",
  },
];

export default function CommunityHubPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 1,
      sender: "b3as1",
      text: "Welcome to the Beast Clipping community chat! 🔥",
      time: "2:30 PM",
    },
    {
      id: 2,
      sender: "ClipMaster99",
      text: "Just posted my first viral clip!",
      time: "2:31 PM",
    },
    {
      id: 3,
      sender: "GamerKing",
      text: "This app is insane for making shorts",
      time: "2:32 PM",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [previewLink, setPreviewLink] = useState("");

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        sender: "You",
        text: chatInput,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setChatInput("");
  };

  const generatePreviewLink = () => {
    const link = `https://beastclipping.io/live/${Math.random().toString(36).slice(2, 8)}`;
    setPreviewLink(link);
    toast.success("Live preview link created!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/25 to-primary/8 border border-primary/30 flex items-center justify-center neon-glow-sm">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight">
            Community Hub
          </h1>
          <p className="text-muted-foreground text-sm">
            Collaborate, learn, and compete
          </p>
        </div>
      </div>

      <Tabs defaultValue="chat">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="contests">Contests</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main chat */}
            <div
              className="lg:col-span-2 glass-card flex flex-col"
              style={{ height: 420 }}
            >
              <div className="flex items-center gap-2 p-4 border-b border-white/8">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm">#general</span>
                <span className="ml-auto text-[10px] bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                  127 online
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2 ${m.sender === "You" ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/20 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      {m.sender[0]}
                    </div>
                    <div
                      className={`max-w-[75%] ${m.sender === "You" ? "items-end" : "items-start"} flex flex-col`}
                    >
                      <span className="text-[10px] text-muted-foreground mb-0.5">
                        {m.sender} · {m.time}
                      </span>
                      <div
                        className={`px-3 py-2 rounded-xl text-sm ${m.sender === "You" ? "bg-primary/20 border border-primary/30 text-foreground" : "bg-white/5 border border-white/8"}`}
                      >
                        {m.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/8 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Message #general..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                />
                <Button size="sm" onClick={sendMessage}>
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-3">
              <div className="glass-card p-4 space-y-3">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  Live Preview
                </h3>
                <p className="text-muted-foreground text-xs">
                  Share a link so clients can watch you edit in real-time
                </p>
                {previewLink && (
                  <div className="bg-white/5 rounded-lg p-2 text-xs text-primary font-mono break-all">
                    {previewLink}
                  </div>
                )}
                <Button
                  size="sm"
                  className="w-full"
                  variant="outline"
                  onClick={generatePreviewLink}
                >
                  Generate Link
                </Button>
              </div>
              <div className="glass-card p-4 space-y-2">
                <h3 className="font-bold text-sm text-muted-foreground uppercase text-xs tracking-wider">
                  Online Members
                </h3>
                {[
                  "b3as1",
                  "ClipMaster99",
                  "GamerKing",
                  "EditQueen",
                  "ViralVault",
                ].map((u) => (
                  <div key={u} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{u}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Style Market */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold">Style Market</h3>
            <p className="text-muted-foreground text-xs">
              Download caption presets from top creators
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CAPTION_STYLES.map((s) => (
                <div
                  key={s.name}
                  className="glass-card p-3 space-y-2 text-center"
                >
                  <p style={s.style as React.CSSProperties} className="text-sm">
                    {s.preview}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.name}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-6 text-xs"
                    onClick={() =>
                      toast.success(`${s.name} preset downloaded!`)
                    }
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Get
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="mt-4">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-xl">
                  Your Public Portfolio
                </h3>
                <p className="text-muted-foreground text-sm">
                  beastclipping.io/u/you
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://beastclipping.io/u/you",
                  );
                  toast.success("Link copied!");
                }}
              >
                <Link2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6"] as const
              ).map((id, i) => (
                <div
                  key={id}
                  className="aspect-video rounded-lg bg-gradient-to-br from-white/5 to-white/2 border border-white/8 flex items-center justify-center text-muted-foreground text-xs"
                >
                  {i < 3 ? (
                    `Clip ${i + 1}`
                  ) : (
                    <span className="text-white/20">Empty</span>
                  )}
                </div>
              ))}
            </div>
            <Button
              className="neon-glow-sm"
              onClick={() => toast.success("Portfolio updated!")}
            >
              Update Portfolio
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TUTORIALS.map((t) => (
              <button
                key={t.title}
                type="button"
                className="glass-card p-4 space-y-3 hover:border-primary/30 transition-colors cursor-pointer text-left w-full"
                onClick={() => toast.success(`Opening: ${t.title}`)}
              >
                <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 border border-white/8 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary/50" />
                </div>
                <div>
                  <p className="font-bold text-sm">{t.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {t.views} views
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.duration}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contests" className="mt-4 space-y-4">
          {CONTESTS.map((c) => (
            <div key={c.title} className="cyber-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="font-bold">{c.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Ends in {c.ends} · {c.entries} entries
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Prize</p>
                  <p className="font-bold text-yellow-400 text-sm">{c.prize}</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
                  style={{ width: "45%" }}
                />
              </div>
              <Button
                className="w-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
                onClick={() => toast.success("Entry submitted!")}
              >
                Enter Contest
              </Button>
            </div>
          ))}
          <div className="glass-card p-5 space-y-3">
            <h3 className="font-bold">Leaderboard</h3>
            {[
              "b3as1 — 2,400 pts",
              "ClipMaster99 — 1,890 pts",
              "GamerKing — 1,540 pts",
              "EditQueen — 1,200 pts",
              "ViralVault — 980 pts",
            ].map((entry, i) => (
              <div
                key={entry}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/3"
              >
                <span
                  className={`font-black text-sm w-5 text-center ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-orange-400" : "text-muted-foreground"}`}
                >
                  {i + 1}
                </span>
                <span className="text-sm flex-1">{entry}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart2,
  Calendar,
  Hash,
  Image,
  MessageSquare,
  Mic,
  PenTool,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SAMPLE_HASHTAGS = [
  "#Shorts",
  "#Gaming",
  "#ClipOfTheDay",
  "#Viral",
  "#ContentCreator",
  "#YouTube",
  "#Trending",
  "#Highlights",
  "#Creator",
  "#BeastMode",
];

const CREATORS = [
  { name: "TechClips Pro", niche: "Tech", price: "$25/clip", rating: "4.9" },
  { name: "GameEdit King", niche: "Gaming", price: "$15/clip", rating: "4.8" },
  { name: "VlogMaster", niche: "Lifestyle", price: "$30/clip", rating: "5.0" },
  {
    name: "ShortsCraft",
    niche: "All niches",
    price: "$20/clip",
    rating: "4.7",
  },
  { name: "ViralVault", niche: "Finance", price: "$35/clip", rating: "4.9" },
  { name: "ReelRocket", niche: "Fitness", price: "$18/clip", rating: "4.6" },
];

export default function GrowthHubPage() {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [energy, setEnergy] = useState([60]);
  const [titleInput, setTitleInput] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Record<string, string>>({});
  const [threadInput, setThreadInput] = useState("");

  const generateHashtags = () => {
    if (!topic.trim()) {
      toast.error("Enter a topic first");
      return;
    }
    setHashtags(SAMPLE_HASHTAGS.slice(0, 10));
    toast.success("10 hashtags generated!");
  };

  const generateTitles = () => {
    if (!titleInput.trim()) {
      toast.error("Enter your clip topic first");
      return;
    }
    setTitles([
      `You WON'T BELIEVE what happened when ${titleInput}`,
      `I Tried ${titleInput} For 30 Days... (shocking results)`,
      `How To ${titleInput} Like A Pro in 2025`,
      `${titleInput}: A Complete Beginner's Guide`,
      `Why Is Everyone Talking About ${titleInput}?`,
    ]);
  };

  const viral = Math.round(40 + energy[0] * 0.55);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/25 to-primary/8 border border-primary/30 flex items-center justify-center neon-glow-sm">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight">
            Growth Hub
          </h1>
          <p className="text-muted-foreground text-sm">
            Marketing & social growth tools
          </p>
        </div>
      </div>

      <Tabs defaultValue="generator">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hashtag Generator */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm">Hashtag Generator</h3>
              </div>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your clip topic (e.g. 'epic gaming moments')..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                rows={3}
              />
              <Button
                size="sm"
                className="w-full neon-glow-sm"
                onClick={generateHashtags}
              >
                Generate Hashtags
              </Button>
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {hashtags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(tag);
                        toast.success(`Copied ${tag}`);
                      }}
                      className="px-2 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/25 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title Rewriter */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm">Title Rewriter</h3>
              </div>
              <input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Your clip topic..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <Button
                size="sm"
                className="w-full"
                variant="outline"
                onClick={generateTitles}
              >
                Generate 5 Titles
              </Button>
              {titles.length > 0 && (
                <div className="space-y-1.5">
                  {titles.map((t, i) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(t);
                        toast.success("Title copied!");
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/40 text-xs transition-all"
                    >
                      <span className="text-primary font-bold text-[10px] mr-1">
                        {
                          [
                            "CLICKBAIT",
                            "CLICKBAIT",
                            "EDUCATIONAL",
                            "EDUCATIONAL",
                            "QUESTION",
                          ][i]
                        }
                      </span>{" "}
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Engagement Predictor */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm">Engagement Predictor</h3>
                <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full">
                  AI
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                Set your clip's energy level and see virality prediction
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Clip Energy</span>
                  <span className="text-primary font-bold">{energy[0]}%</span>
                </div>
                <Slider
                  value={energy}
                  onValueChange={setEnergy}
                  max={100}
                  step={1}
                />
              </div>
              <div className="rounded-xl bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20 p-4 text-center">
                <p
                  className="text-3xl font-black text-primary"
                  style={{
                    filter: "drop-shadow(0 0 12px oklch(0.88 0.17 200 / 0.6))",
                  }}
                >
                  {viral}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Predicted virality on Reels
                </p>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
                    style={{
                      width: `${viral}%`,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Podcast to Thread */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm">Podcast-to-Thread</h3>
              </div>
              <p className="text-muted-foreground text-xs">
                Turn a clip transcript into a Twitter/X thread
              </p>
              <textarea
                value={threadInput}
                onChange={(e) => setThreadInput(e.target.value)}
                placeholder="Paste your clip transcript here..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                rows={4}
              />
              <Button
                size="sm"
                className="w-full"
                variant="outline"
                onClick={() =>
                  toast.success("Thread generated! 5 tweets ready to post")
                }
              >
                Convert to Thread
              </Button>
            </div>
          </div>

          {/* Thumbnail Stitcher */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">Thumbnail Stitcher</h3>
              <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full">
                AI
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["Shock Face", "Bold Text", "Split Scene"].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toast.success(`${style} thumbnail generated!`)}
                  className="aspect-video rounded-lg bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-all"
                >
                  <Image className="w-4 h-4" />
                  {style}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              className="w-full neon-glow-sm"
              onClick={() => toast.success("High-CTR thumbnail generated!")}
            >
              Auto-Generate Thumbnail
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="scheduler" className="mt-4">
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-bold">Social Scheduler</h3>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day) => (
                <div key={day} className="space-y-1.5">
                  <p className="text-center text-xs text-muted-foreground font-medium">
                    {day}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const t = prompt(
                        `Schedule post for ${day} (enter time):`,
                      );
                      if (t) {
                        setSchedule((s) => ({ ...s, [day]: t }));
                        toast.success(`Scheduled for ${day} at ${t}`);
                      }
                    }}
                    className="w-full aspect-square rounded-lg bg-white/3 border border-white/8 flex items-center justify-center text-xs hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    {schedule[day] ? (
                      <span className="text-primary font-bold text-[10px]">
                        {schedule[day]}
                      </span>
                    ) : (
                      <span className="text-white/20 text-lg">+</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {["TikTok", "Instagram", "YouTube"].map((p) => (
                <div key={p} className="glass-card p-3 text-center">
                  <p className="text-xs font-bold text-foreground">{p}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {Math.floor(Math.random() * 3) + 1} scheduled
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Reach", value: "124K", change: "+18%", up: true },
              { label: "Impressions", value: "892K", change: "+32%", up: true },
              { label: "Avg CTR", value: "4.2%", change: "-0.3%", up: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-5 text-center space-y-1"
              >
                <p className="text-muted-foreground text-xs">{stat.label}</p>
                <p className="text-3xl font-black text-foreground">
                  {stat.value}
                </p>
                <p
                  className={`text-xs font-bold ${stat.up ? "text-green-400" : "text-red-400"}`}
                >
                  {stat.change} this week
                </p>
              </div>
            ))}
            <div className="glass-card p-5 md:col-span-3 space-y-3">
              <h3 className="font-bold text-sm">Competitor Benchmarking</h3>
              <div className="space-y-2">
                {[
                  ["Your clips", 78],
                  ["Top Creator A", 92],
                  ["Top Creator B", 85],
                  ["Niche Average", 61],
                ].map(([label, val]) => (
                  <div key={label as string} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-foreground font-bold">
                        {val}/100
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {CREATORS.map((c) => (
                <div key={c.name} className="glass-card p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/20 border border-primary/25 flex items-center justify-center font-bold text-primary">
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.niche}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Rate</span>
                    <span className="text-primary font-bold">{c.price}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="text-yellow-400 font-bold">
                      ⭐ {c.rating}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    variant="outline"
                    onClick={() => toast.success(`Message sent to ${c.name}`)}
                  >
                    Hire
                  </Button>
                </div>
              ))}
            </div>
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm">Auto-Reply Bot</h3>
              </div>
              <p className="text-muted-foreground text-xs">
                Automatically draft responses to common comments
              </p>
              <div className="space-y-2">
                {[
                  '"Great video!"',
                  '"Where can I find more?"',
                  '"How did you do that?"',
                ].map((comment) => (
                  <div
                    key={comment}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/3 border border-white/8"
                  >
                    <span className="text-xs text-muted-foreground flex-1">
                      {comment}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-primary h-6 px-2"
                      onClick={() => toast.success("Reply drafted!")}
                    >
                      Draft Reply
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

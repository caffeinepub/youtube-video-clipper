import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUpRight,
  Compass,
  Download,
  Flame,
  Heart,
  Music2,
  Play,
  RefreshCw,
  Share2,
  ShoppingBag,
  Star,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

const MOCK_CLIPS = [
  {
    id: 1,
    user: "@beast_creator",
    title: "Insane 360 no-scope moment",
    views: "124K",
    likes: 8420,
    category: "Gaming",
    thumb: "🎮",
  },
  {
    id: 2,
    user: "@vlog_queen",
    title: "Travel montage - Bali highlights",
    views: "89K",
    likes: 5230,
    category: "Vlog",
    thumb: "✈️",
  },
  {
    id: 3,
    user: "@podcastkings",
    title: "Mind-blowing Elon interview clip",
    views: "212K",
    likes: 14100,
    category: "Podcast",
    thumb: "🎤",
  },
  {
    id: 4,
    user: "@react_god",
    title: "Karen moment compilation",
    views: "341K",
    likes: 22400,
    category: "Reaction",
    thumb: "😱",
  },
  {
    id: 5,
    user: "@sports_clips",
    title: "Last-second game winner",
    views: "567K",
    likes: 38200,
    category: "Sports",
    thumb: "🏀",
  },
  {
    id: 6,
    user: "@cooking_lab",
    title: "Perfect steak in 3 minutes",
    views: "78K",
    likes: 4100,
    category: "Lifestyle",
    thumb: "🥩",
  },
];

const TRENDING_TOPICS = [
  { topic: "#GamingHighlights", clips: "12.4K", trend: "+34%" },
  { topic: "#PodcastClips", clips: "8.1K", trend: "+28%" },
  { topic: "#ReactionVideos", clips: "6.7K", trend: "+19%" },
  { topic: "#MotivationalSpeech", clips: "5.2K", trend: "+41%" },
  { topic: "#CookingTips", clips: "4.8K", trend: "+15%" },
  { topic: "#TechUnboxing", clips: "3.9K", trend: "+22%" },
];

const TRENDING_SOUNDS = [
  { name: "Epic Orchestral Hit", uses: "34.2K", artist: "SoundLib" },
  { name: "Lo-fi Chill Beat", uses: "28.9K", artist: "ChillWave" },
  { name: "Neon Synth Drop", uses: "21.4K", artist: "CyberBeats" },
  { name: "Anime Opening Sting", uses: "18.7K", artist: "AniSound" },
];

const TEMPLATES = [
  {
    id: 1,
    creator: "@beast_creator",
    name: "Neon Gaming Clip",
    downloads: 2340,
    rating: 4.9,
    price: "Free",
    emoji: "🎮",
  },
  {
    id: 2,
    creator: "@vlog_queen",
    name: "Travel Reel Pro",
    downloads: 1820,
    rating: 4.8,
    price: "Free",
    emoji: "✈️",
  },
  {
    id: 3,
    creator: "@podcastkings",
    name: "Podcast Highlight Reel",
    downloads: 1540,
    rating: 4.7,
    price: "Free",
    emoji: "🎤",
  },
  {
    id: 4,
    creator: "@react_god",
    name: "Reaction Split Screen",
    downloads: 3100,
    rating: 5.0,
    price: "Free",
    emoji: "😱",
  },
  {
    id: 5,
    creator: "@editor_pro",
    name: "Corporate Promo Kit",
    downloads: 890,
    rating: 4.6,
    price: "Free",
    emoji: "💼",
  },
  {
    id: 6,
    creator: "@sports_clips",
    name: "Sports Hype Reel",
    downloads: 2780,
    rating: 4.8,
    price: "Free",
    emoji: "🏆",
  },
];

function CommunityShowcase() {
  const [liked, setLiked] = useState<number[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Compass className="w-4 h-4 text-primary" />
        <h2 className="text-white font-bold text-lg">Community Showcase</h2>
        <span className="text-xs text-muted-foreground ml-auto">
          Updated live
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_CLIPS.map((clip) => (
          <div
            key={clip.id}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all group"
            data-ocid={`discover.item.${clip.id}`}
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center relative">
              <span className="text-5xl">{clip.thumb}</span>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => toast.success(`Playing: ${clip.title}`)}
                  className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  data-ocid="discover.button"
                >
                  <Play className="w-4 h-4 text-black" fill="black" />
                </button>
              </div>
              <Badge className="absolute top-2 right-2 bg-black/60 text-white border-white/20 text-[10px]">
                {clip.category}
              </Badge>
            </div>
            {/* Info */}
            <div className="p-3 space-y-2">
              <div>
                <p className="text-white text-sm font-medium truncate">
                  {clip.title}
                </p>
                <p className="text-muted-foreground text-xs">
                  {clip.user} · {clip.views} views
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLiked(
                      liked.includes(clip.id)
                        ? liked.filter((x) => x !== clip.id)
                        : [...liked, clip.id],
                    );
                  }}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    liked.includes(clip.id)
                      ? "text-red-400"
                      : "text-muted-foreground hover:text-red-400"
                  }`}
                  data-ocid="discover.toggle"
                >
                  <Heart
                    className="w-3.5 h-3.5"
                    fill={liked.includes(clip.id) ? "currentColor" : "none"}
                  />
                  {(
                    clip.likes + (liked.includes(clip.id) ? 1 : 0)
                  ).toLocaleString()}
                </button>
                <button
                  type="button"
                  onClick={() => toast.success(`Remix started: ${clip.title}`)}
                  className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors border border-primary/30 px-2 py-0.5 rounded-full hover:bg-primary/10"
                  data-ocid="discover.button"
                >
                  <RefreshCw className="w-3 h-3" /> Remix
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://beastclipping.io/clip/${clip.id}`,
                    );
                    toast.success("Link copied!");
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-ocid="discover.button"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyViralTrends() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-400" />
        <h2 className="text-white font-bold text-lg">Daily Viral Trends</h2>
        <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full">
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trending Topics */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-white font-semibold text-sm">
              Trending Topics
            </h3>
          </div>
          {TRENDING_TOPICS.map((t, i) => (
            <div key={t.topic} className="flex items-center gap-3 py-1.5">
              <span className="text-muted-foreground text-xs w-5 font-mono">
                {i + 1}.
              </span>
              <span className="text-primary text-sm font-medium flex-1">
                {t.topic}
              </span>
              <span className="text-xs text-muted-foreground">
                {t.clips} clips
              </span>
              <span className="text-xs text-green-400 font-semibold">
                {t.trend}
              </span>
              <ArrowUpRight className="w-3 h-3 text-green-400" />
            </div>
          ))}
        </div>

        {/* Trending Sounds */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-white font-semibold text-sm">
              Trending Sounds
            </h3>
          </div>
          {TRENDING_SOUNDS.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3 py-1.5">
              <span className="text-muted-foreground text-xs w-5 font-mono">
                {i + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium">{s.name}</p>
                <p className="text-muted-foreground text-[10px]">{s.artist}</p>
              </div>
              <span className="text-xs text-muted-foreground">{s.uses}</span>
              <button
                type="button"
                onClick={() => toast.success(`Added sound: ${s.name}`)}
                className="text-xs text-primary hover:text-primary/80 border border-primary/30 px-2 py-0.5 rounded hover:bg-primary/10 transition-colors"
                data-ocid="discover.button"
              >
                Use
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateMarketplace() {
  const [search, setSearch] = useState("");

  const filtered = TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.creator.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-4 h-4 text-yellow-400" />
        <h2 className="text-white font-bold text-lg">Template Marketplace</h2>
        <Badge className="bg-green-500/15 text-green-300 border-green-500/30 text-xs">
          All Free
        </Badge>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search templates…"
        className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
        data-ocid="discover.search_input"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 hover:border-primary/30 transition-all"
            data-ocid={`discover.template.item.${t.id}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl flex-shrink-0">
                {t.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.creator}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-yellow-400">
                <Star className="w-3 h-3" fill="currentColor" /> {t.rating}
              </span>
              <span className="text-muted-foreground">
                <Download className="w-3 h-3 inline mr-1" />
                {t.downloads.toLocaleString()}
              </span>
              <Badge className="ml-auto bg-green-500/15 text-green-300 border-green-500/30 text-[10px]">
                {t.price}
              </Badge>
            </div>
            <Button
              size="sm"
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs h-8"
              onClick={() => toast.success(`Template "${t.name}" applied!`)}
              data-ocid="discover.template.button"
            >
              <Download className="w-3 h-3 mr-1.5" /> Use Template
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<
    "showcase" | "trends" | "templates"
  >("showcase");

  const tabs: Array<{
    id: "showcase" | "trends" | "templates";
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "showcase",
      label: "Community",
      icon: <Compass className="w-3.5 h-3.5" />,
    },
    {
      id: "trends",
      label: "Viral Trends",
      icon: <Flame className="w-3.5 h-3.5" />,
    },
    {
      id: "templates",
      label: "Templates",
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight flex items-center gap-2">
          <Compass className="w-6 h-6 text-primary" />
          Discover
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Explore trending clips, viral sounds, and community templates
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-white"
            }`}
            data-ocid={`discover.${tab.id}.tab`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "showcase" && <CommunityShowcase />}
      {activeTab === "trends" && <DailyViralTrends />}
      {activeTab === "templates" && <TemplateMarketplace />}

      <p className="text-center text-xs text-muted-foreground/50 pb-4 flex items-center justify-center gap-1">
        Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}

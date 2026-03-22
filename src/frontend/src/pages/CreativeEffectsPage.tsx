import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Eye,
  EyeOff,
  Film,
  Mic2,
  Monitor,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Type,
  Video,
  Wand2,
  ZoomIn,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

// Sound Wave component
function SoundWaveVisualizer({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-12 px-2">
      {[
        "b1",
        "b2",
        "b3",
        "b4",
        "b5",
        "b6",
        "b7",
        "b8",
        "b9",
        "b10",
        "b11",
        "b12",
        "b13",
        "b14",
        "b15",
        "b16",
        "b17",
        "b18",
        "b19",
        "b20",
        "b21",
        "b22",
        "b23",
        "b24",
      ].map((id, i) => (
        <div
          key={id}
          className="w-1.5 rounded-full bg-primary"
          style={{
            height: active ? `${20 + Math.sin(i * 0.8) * 15 + 10}%` : "15%",
            animation: active
              ? `soundBar ${0.5 + (i % 5) * 0.15}s ease-in-out infinite alternate`
              : "none",
            animationDelay: `${i * 0.04}s`,
            opacity: 0.7 + (i % 3) * 0.1,
            transition: "height 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

// Progress Ring component
function ProgressRing({
  value,
  max,
  size = 80,
}: { value: number; max: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  return (
    <svg
      width={size}
      height={size}
      className="-rotate-90"
      role="img"
      aria-label="Progress ring"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="oklch(0.88 0.17 200)"
        strokeWidth="5"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.5s ease",
          filter: "drop-shadow(0 0 6px oklch(0.88 0.17 200 / 0.8))",
        }}
      />
    </svg>
  );
}

export default function CreativeEffectsPage() {
  const [vignetteOn, setVignetteOn] = useState(false);
  const [glowOn, setGlowOn] = useState(false);
  const [letterboxOn, setLetterboxOn] = useState(false);
  const [skinSmootherOn, setSkinSmootherOn] = useState(false);
  const [soundWaveOn, setSoundWaveOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState([0]);
  const [countdown, setCountdown] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            setTimerRunning(false);
            return 10;
          }
          return c - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const applyEffect = (name: string) =>
    toast.success(`${name} applied to clip`);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <style>{`
        @keyframes soundBar { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }
        @keyframes glowPulse { 0%,100% { text-shadow: 0 0 8px oklch(0.88 0.17 200); } 50% { text-shadow: 0 0 24px oklch(0.88 0.17 200), 0 0 40px oklch(0.88 0.17 200 / 0.5); } }
      `}</style>

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/25 to-primary/8 border border-primary/30 flex items-center justify-center neon-glow-sm">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight">
            Creative Effects
          </h1>
          <p className="text-muted-foreground text-sm">
            Visual & audio overlays for your clips
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Progress Ring */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <ZoomIn className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-bold text-sm">Dynamic Progress Ring</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Circular countdown timer for Top 10 reveals
          </p>
          <div className="flex items-center justify-center py-2">
            <div className="relative">
              <ProgressRing value={countdown} max={10} size={88} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-black text-xl text-primary">
                  {countdown}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 neon-glow-sm"
              onClick={() => setTimerRunning(!timerRunning)}
            >
              {timerRunning ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Start
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setTimerRunning(false);
                setCountdown(10);
              }}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Sound Wave */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Mic2 className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-sm">Sound Wave Visualizer</h3>
            </div>
            <Switch checked={soundWaveOn} onCheckedChange={setSoundWaveOn} />
          </div>
          <p className="text-muted-foreground text-xs">
            Audiogram-style waveform for podcast clips
          </p>
          <div className="rounded-lg bg-black/30 border border-white/5 overflow-hidden">
            <SoundWaveVisualizer active={soundWaveOn} />
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => applyEffect("Sound Wave Visualizer")}
          >
            Apply to Clip
          </Button>
        </div>

        {/* Auto Vignette */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Eye className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-sm">Auto-Vignette</h3>
            </div>
            <Switch checked={vignetteOn} onCheckedChange={setVignetteOn} />
          </div>
          <p className="text-muted-foreground text-xs">
            Darkens edges to focus attention on the speaker
          </p>
          <div className="aspect-video rounded-lg bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-white/5 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20" />
            </div>
            {vignetteOn && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)",
                }}
              />
            )}
          </div>
        </div>

        {/* Glow Captions */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Type className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-sm">Glow Captions</h3>
            </div>
            <Switch checked={glowOn} onCheckedChange={setGlowOn} />
          </div>
          <p className="text-muted-foreground text-xs">
            Karaoke-style text that glows as words are spoken
          </p>
          <div className="bg-black/40 rounded-lg p-4 text-center">
            <p
              className="text-lg font-bold text-primary"
              style={
                glowOn
                  ? { animation: "glowPulse 1.5s ease-in-out infinite" }
                  : {}
              }
            >
              This is viral content ✨
            </p>
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => applyEffect("Glow Captions")}
          >
            Apply to Clip
          </Button>
        </div>

        {/* Cinematic Letterboxing */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Film className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-sm">Cinematic Letterboxing</h3>
            </div>
            <Switch checked={letterboxOn} onCheckedChange={setLetterboxOn} />
          </div>
          <p className="text-muted-foreground text-xs">
            One-click black bars for a movie look
          </p>
          <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white/50">
              Preview
            </div>
            {letterboxOn && (
              <>
                <div className="absolute top-0 left-0 right-0 h-[14%] bg-black" />
                <div className="absolute bottom-0 left-0 right-0 h-[14%] bg-black" />
              </>
            )}
          </div>
        </div>

        {/* Intelligent Zoom */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <ZoomIn className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-bold text-sm">Intelligent Zoom</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Slow-creeping zoom on emotional punchlines
          </p>
          <div className="aspect-video rounded-lg bg-gradient-to-br from-indigo-900/30 to-cyan-900/20 overflow-hidden border border-white/5 flex items-center justify-center">
            <div
              className="text-3xl"
              style={{
                transform: `scale(${1 + zoomLevel[0] / 100})`,
                transition: "transform 0.3s ease",
              }}
            >
              🎬
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Zoom Intensity</span>
              <span>{zoomLevel[0]}%</span>
            </div>
            <Slider
              value={zoomLevel}
              onValueChange={setZoomLevel}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => applyEffect("Intelligent Zoom")}
          >
            Apply to Clip
          </Button>
        </div>

        {/* AI Skin Smoother */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/15 flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-pink-400" />
              </div>
              <h3 className="font-bold text-sm">AI Skin Smoother</h3>
              <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full font-semibold">
                AI
              </span>
            </div>
            <Switch
              checked={skinSmootherOn}
              onCheckedChange={setSkinSmootherOn}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Subtle beauty filter for creators on bad hair days
          </p>
          <div className="flex gap-3 items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-300/40 to-pink-300/20 border border-white/10 flex items-center justify-center text-2xl">
              😊
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-2 rounded bg-white/10">
                <div
                  className="h-full rounded bg-pink-400/60"
                  style={{
                    width: skinSmootherOn ? "75%" : "0%",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {skinSmootherOn ? "Smoothing active (75%)" : "Off"}
              </p>
            </div>
          </div>
        </div>

        {/* 3D Text Overlays */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Type className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-bold text-sm">3D Text Overlays</h3>
            <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full font-semibold">
              AI
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            Place text "behind" the speaker using depth sensing
          </p>
          <div className="bg-black/40 rounded-lg p-4 text-center">
            <p
              className="font-black text-2xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(0,242,255,0.3), 6px 6px 0 rgba(0,242,255,0.15)",
                color: "white",
              }}
            >
              BEAST MODE
            </p>
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => applyEffect("3D Text Overlay")}
          >
            Apply to Clip
          </Button>
        </div>

        {/* Screen Recording Overlay */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-bold text-sm">Screen Recording Overlay</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Picture-in-picture for tutorial creators
          </p>
          <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 relative border border-white/5">
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white/30">
              Main Screen
            </div>
            <div className="absolute bottom-2 right-2 w-16 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Video className="w-4 h-4 text-primary" />
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => applyEffect("Screen Recording Overlay")}
          >
            Enable PiP
          </Button>
        </div>

        {/* Custom Outros */}
        <div className="glass-card p-5 space-y-3 md:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Video className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-bold text-sm">Custom Outros</h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Auto-append your "Follow for more" screen to every clip
          </p>
          <div className="space-y-2">
            {[
              "Follow for more 🔥",
              "Subscribe for daily clips!",
              "Turn on notifications! 🔔",
            ].map((outro) => (
              <button
                key={outro}
                type="button"
                onClick={() => applyEffect("Outro")}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 text-sm transition-all"
              >
                {outro}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            className="w-full neon-glow-sm"
            onClick={() => toast.success("Outro added to all clips")}
          >
            Apply to All Clips
          </Button>
        </div>
      </div>
    </div>
  );
}

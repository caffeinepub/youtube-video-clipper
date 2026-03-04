import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface MemeSound {
  id: string;
  label: string;
  emoji: string;
  frequency: number;
  type: "sine" | "square" | "sawtooth" | "triangle";
  description: string;
}

const MEME_SOUNDS: MemeSound[] = [
  {
    id: "airhorn",
    label: "Airhorn",
    emoji: "🎺",
    frequency: 440,
    type: "square",
    description: "Classic airhorn blast",
  },
  {
    id: "bruh",
    label: "Bruh",
    emoji: "😤",
    frequency: 120,
    type: "sawtooth",
    description: "Deep bruh sound",
  },
  {
    id: "mission-failed",
    label: "Mission Failed",
    emoji: "🎮",
    frequency: 220,
    type: "sine",
    description: "We'll get 'em next time",
  },
  {
    id: "poggers",
    label: "Poggers",
    emoji: "💥",
    frequency: 880,
    type: "triangle",
    description: "Hype moment!",
  },
];

function playBeep(
  frequency: number,
  type: OscillatorType,
  duration = 0.4,
): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + duration,
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Web Audio API not available
  }
}

export default function MemeOverlayLibrary() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const handlePlay = (sound: MemeSound) => {
    setActive(sound.id);
    playBeep(sound.frequency, sound.type);
    toast(`${sound.emoji} ${sound.label} overlay applied!`, {
      description: sound.description,
    });
    setTimeout(() => setActive(null), 600);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/8 hover:bg-white/5 transition-all"
          data-ocid="meme.button"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🎭</span>
            <span className="text-white font-semibold text-sm">
              Meme Overlays
            </span>
            <span className="text-xs text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded-full">
              {MEME_SOUNDS.length}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pt-2 grid grid-cols-2 gap-2">
          {MEME_SOUNDS.map((sound) => (
            <button
              key={sound.id}
              type="button"
              onClick={() => handlePlay(sound)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 ${
                active === sound.id
                  ? "bg-primary/20 border-primary/50 text-primary neon-glow-sm scale-95"
                  : "bg-white/5 border-white/8 text-muted-foreground hover:bg-white/10 hover:text-white hover:border-primary/30"
              }`}
              data-ocid="meme.button"
              title={sound.description}
            >
              <span className="text-base leading-none">{sound.emoji}</span>
              <span className="text-xs">{sound.label}</span>
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

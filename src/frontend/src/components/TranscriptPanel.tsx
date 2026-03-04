import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";

interface TranscriptLine {
  timestamp: string;
  seconds: number;
  text: string;
}

interface TranscriptPanelProps {
  videoId: string;
  onSelectTimestamp?: (startSec: number, endSec: number) => void;
}

const FAKE_TRANSCRIPTS: TranscriptLine[] = [
  {
    timestamp: "0:05",
    seconds: 5,
    text: "Welcome to the gameplay stream, let's get into it.",
  },
  {
    timestamp: "0:18",
    seconds: 18,
    text: "Loading into the match now, full squad is ready.",
  },
  {
    timestamp: "0:32",
    seconds: 32,
    text: "That was an insane move right there! Did you see that?",
  },
  {
    timestamp: "0:47",
    seconds: 47,
    text: "Okay okay, pushing up the left flank — watch this play.",
  },
  {
    timestamp: "1:03",
    seconds: 63,
    text: "THREE DOWN! Three eliminations in a row, let's GO!",
  },
  {
    timestamp: "1:20",
    seconds: 80,
    text: "Squad wiped! We just took out the whole enemy team!",
  },
  {
    timestamp: "1:45",
    seconds: 105,
    text: "Securing the objective now while they're down.",
  },
  {
    timestamp: "2:10",
    seconds: 130,
    text: "Chat going crazy in the comments, I can see you all.",
  },
  {
    timestamp: "2:33",
    seconds: 153,
    text: "Victory screen incoming — clean sweep no contest.",
  },
  {
    timestamp: "2:58",
    seconds: 178,
    text: "That's game! Best play of the session right there, no cap.",
  },
];

export default function TranscriptPanel({
  videoId,
  onSelectTimestamp,
}: TranscriptPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [highlightedIdx, setHighlightedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLines([]);
    // Simulate async transcript generation
    await new Promise((r) => setTimeout(r, 2000));
    setLines(FAKE_TRANSCRIPTS);
    setIsGenerating(false);
  };

  const handleLineClick = (line: TranscriptLine, idx: number) => {
    setHighlightedIdx(idx);
    const nextLine = FAKE_TRANSCRIPTS[idx + 1];
    const endSec = nextLine ? nextLine.seconds - 1 : line.seconds + 15;
    onSelectTimestamp?.(line.seconds, endSec);
  };

  if (!videoId) return null;

  return (
    <div className="glass-card p-4 space-y-3" data-ocid="transcript.panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-white font-semibold text-sm">Smart Transcript</h3>
          {lines.length > 0 && (
            <span className="text-xs text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
              {lines.length} lines
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="h-7 text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
          data-ocid="transcript.button"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 mr-1.5" />
              {lines.length > 0 ? "Re-generate" : "Generate Transcript"}
            </>
          )}
        </Button>
      </div>

      {/* Hint */}
      {lines.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Click any line to set clip start/end points
        </p>
      )}

      {/* Transcript Lines */}
      {isGenerating && (
        <div
          className="flex flex-col items-center justify-center py-8 gap-3"
          data-ocid="transcript.loading_state"
        >
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-primary"
                style={{
                  height: `${16 + Math.random() * 16}px`,
                  animation: "waveform-pulse 0.6s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-xs">Analyzing audio…</p>
        </div>
      )}

      {!isGenerating && lines.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-6 text-center"
          data-ocid="transcript.empty_state"
        >
          <FileText className="w-8 h-8 text-muted-foreground/30 mb-2" />
          <p className="text-muted-foreground text-sm">No transcript yet</p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            Click "Generate Transcript" to create timestamped captions
          </p>
        </div>
      )}

      {lines.length > 0 && (
        <ScrollArea className="max-h-48">
          <div className="space-y-1">
            {lines.map((line, idx) => (
              <button
                key={line.seconds}
                type="button"
                onClick={() => handleLineClick(line, idx)}
                className={`w-full text-left flex items-start gap-3 px-2 py-1.5 rounded-lg text-xs transition-all duration-150 ${
                  highlightedIdx === idx
                    ? "bg-primary/15 border border-primary/30 text-white"
                    : "hover:bg-white/5 text-muted-foreground hover:text-white border border-transparent"
                }`}
                data-ocid={`transcript.item.${idx + 1}`}
              >
                <span
                  className={`font-mono flex-shrink-0 w-10 text-right ${
                    highlightedIdx === idx ? "text-primary" : "text-primary/60"
                  }`}
                >
                  {line.timestamp}
                </span>
                <span className="leading-relaxed">{line.text}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

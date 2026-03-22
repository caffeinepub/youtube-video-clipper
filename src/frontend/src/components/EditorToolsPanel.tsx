import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Clock,
  CloudDownload,
  Cpu,
  Film,
  Folder,
  Hash,
  History,
  ImagePlay,
  Keyboard,
  Layers,
  LayoutGrid,
  Mic,
  Music,
  Package,
  Palette,
  Rocket,
  Save,
  Scissors,
  Share2,
  Sliders,
  Sparkles,
  Sticker,
  Subtitles,
  Volume2,
  Wand2,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

const ProBadge = () => (
  <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
    PRO
  </span>
);

const EntBadge = () => (
  <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
    ENTERPRISE
  </span>
);

interface PanelProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Panel({ title, icon, children, defaultOpen = false }: PanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <span className="text-white font-semibold text-sm">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t border-white/8 p-4 space-y-4">{children}</div>
      )}
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  pro?: boolean;
  enterprise?: boolean;
  description?: string;
}

function ToggleRow({
  label,
  value,
  onChange,
  pro,
  enterprise,
  description,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-sm text-white">{label}</span>
          {pro && <ProBadge />}
          {enterprise && <EntBadge />}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        className="flex-shrink-0"
      />
    </div>
  );
}

// ── AI TOOLS PANEL ────────────────────────────────────────────────────────────

function AIToolsPanel() {
  const [autoCrop, setAutoCrop] = useState(false);
  const [silenceMsg, setSilenceMsg] = useState("");
  const [highlightMsg, setHighlightMsg] = useState("");
  const [faceTracking, setFaceTracking] = useState(false);
  const [eyeContact, setEyeContact] = useState(false);
  const [bgSwap, setBgSwap] = useState("none");
  const [sentimentMsg, setSentimentMsg] = useState("");
  const [styleTransfer, setStyleTransfer] = useState("none");
  const [lipSync, setLipSync] = useState(false);
  const [autoMusicSync, setAutoMusicSync] = useState(false);
  const [summaryMsg, setSummaryMsg] = useState("");
  const [objectRemoval, setObjectRemoval] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const simulate = (key: string, msg: string, setter: (v: string) => void) => {
    setProcessing(key);
    setTimeout(() => {
      setter(msg);
      setProcessing(null);
      toast.success(msg);
    }, 1200);
  };

  return (
    <Panel title="AI Tools" icon={<Bot className="w-3.5 h-3.5 text-primary" />}>
      <div className="space-y-3">
        {/* Auto-Crop */}
        <div className="space-y-1">
          <ToggleRow
            label="AI Auto-Crop 9:16"
            value={autoCrop}
            onChange={(v) => {
              setAutoCrop(v);
              toast.success(
                v
                  ? "Auto-Crop: ON — detecting speaker position"
                  : "Auto-Crop: OFF",
              );
            }}
            description={
              autoCrop
                ? "Speaker Crop: ON — 9:16 vertical"
                : "Speaker Crop: OFF"
            }
          />
        </div>

        {/* Silence Remover */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Silence Remover</p>
            <p className="text-xs text-muted-foreground">
              {silenceMsg || "Remove ums, ahs & dead air"}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-7 px-3"
            disabled={processing === "silence"}
            onClick={() =>
              simulate("silence", "3 silences removed", setSilenceMsg)
            }
            data-ocid="editor.silence_remover.button"
          >
            {processing === "silence" ? "Scanning…" : "Remove Silences"}
          </Button>
        </div>

        {/* Highlight Detection */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Highlight Detection</p>
            <p className="text-xs text-muted-foreground">
              {highlightMsg || "Detect viral-worthy moments"}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-7 px-3"
            disabled={processing === "highlight"}
            onClick={() =>
              simulate(
                "highlight",
                "4 highlight moments detected",
                setHighlightMsg,
              )
            }
            data-ocid="editor.highlight.button"
          >
            {processing === "highlight" ? "Analyzing…" : "Detect Highlights"}
          </Button>
        </div>

        <div className="border-t border-white/8 pt-3 space-y-1">
          <ToggleRow
            label="Face Tracking"
            value={faceTracking}
            onChange={(v) => {
              setFaceTracking(v);
              toast.success(
                v ? "Face Tracking enabled" : "Face Tracking disabled",
              );
            }}
            description="Keep speaker centered in frame"
          />
          <ToggleRow
            label="Eye Contact Correction"
            value={eyeContact}
            onChange={(v) => {
              setEyeContact(v);
              toast.success(
                v ? "Eye contact correction ON" : "Eye contact correction OFF",
              );
            }}
            description="AI adjusts gaze toward camera"
            pro
          />
        </div>

        {/* Background Swapper */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Background Swap
          </Label>
          <select
            value={bgSwap}
            onChange={(e) => {
              setBgSwap(e.target.value);
              if (e.target.value !== "none")
                toast.success(`Background: ${e.target.value}`);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg text-sm text-white px-3 py-1.5 focus:outline-none focus:border-primary/50"
            data-ocid="editor.bg_swapper.select"
          >
            <option value="none">None</option>
            <option value="blur">Blur Background</option>
            <option value="office">Office</option>
            <option value="studio">Studio</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>

        {/* Sentiment Analysis */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Sentiment Analysis</p>
            <p className="text-xs text-muted-foreground">
              {sentimentMsg || "Find emotional moments in video"}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-7 px-3"
            disabled={processing === "sentiment"}
            onClick={() =>
              simulate(
                "sentiment",
                "Mood: 60% Energetic, 30% Happy, 10% Neutral",
                setSentimentMsg,
              )
            }
            data-ocid="editor.sentiment.button"
          >
            {processing === "sentiment" ? "Analyzing…" : "Analyze Mood"}
          </Button>
        </div>

        {/* Style Transfer */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Style Transfer <ProBadge />
          </Label>
          <select
            value={styleTransfer}
            onChange={(e) => {
              setStyleTransfer(e.target.value);
              if (e.target.value !== "none")
                toast.success(`Style: ${e.target.value} applied`);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg text-sm text-white px-3 py-1.5 focus:outline-none focus:border-primary/50"
            data-ocid="editor.style_transfer.select"
          >
            <option value="none">None</option>
            <option value="cinematic">Cinematic</option>
            <option value="vlog">Vlog</option>
            <option value="horror">Horror</option>
            <option value="35mm">35mm Film</option>
            <option value="cyberpunk">Cyberpunk</option>
          </select>
        </div>

        <div className="border-t border-white/8 pt-3 space-y-1">
          <ToggleRow
            label="Lip Sync Fix"
            value={lipSync}
            onChange={(v) => {
              setLipSync(v);
              toast.success(v ? "Lip sync correction enabled" : "Lip sync OFF");
            }}
            description="Auto-fix audio/video desync"
          />
          <ToggleRow
            label="Auto-Music Sync"
            value={autoMusicSync}
            onChange={(v) => {
              setAutoMusicSync(v);
              toast.success(
                v ? "Cuts will snap to beat" : "Auto-Music Sync OFF",
              );
            }}
            description="Snap cuts to beat of background track"
          />
        </div>

        {/* Video Summarizer */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Video Summarizer</p>
            <p className="text-xs text-muted-foreground">
              {summaryMsg || "Generate a 30-second summary"}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-7 px-3"
            disabled={processing === "summary"}
            onClick={() =>
              simulate(
                "summary",
                "30s summary generated at 0:12–0:42",
                setSummaryMsg,
              )
            }
            data-ocid="editor.summarizer.button"
          >
            {processing === "summary" ? "Generating…" : "Summarize"}
          </Button>
        </div>

        {/* Object Removal */}
        <ToggleRow
          label="Object Removal"
          value={objectRemoval}
          onChange={(v) => {
            setObjectRemoval(v);
            toast.success(
              v ? "Click areas to remove objects" : "Object Removal OFF",
            );
          }}
          description="Paint areas to remove distractions"
          pro
        />
      </div>
    </Panel>
  );
}

// ── CAPTIONS & AUDIO PANEL ────────────────────────────────────────────────────

function CaptionsAudioPanel() {
  const [autoCaptions, setAutoCaptions] = useState(false);
  const [captionLang, setCaptionLang] = useState("en");
  const [captionStyle, setCaptionStyle] = useState("bold");
  const [transLang, setTransLang] = useState("es");
  const [audioDucking, setAudioDucking] = useState(false);
  const [ttsText, setTtsText] = useState("");
  const [ttsVoice, setTtsVoice] = useState("energetic");
  const [captionMsg, setCaptionMsg] = useState("");
  const [processing, setProcessing] = useState(false);

  return (
    <Panel
      title="Captions & Audio"
      icon={<Subtitles className="w-3.5 h-3.5 text-primary" />}
    >
      <div className="space-y-4">
        {/* Auto-Captions */}
        <div className="space-y-3">
          <ToggleRow
            label="Auto-Captions"
            value={autoCaptions}
            onChange={(v) => {
              setAutoCaptions(v);
              toast.success(
                v ? "Captions will be generated" : "Auto-Captions OFF",
              );
            }}
            description="Burnt-in captions from speech-to-text"
          />
          {autoCaptions && (
            <div className="ml-0 space-y-2 pl-3 border-l-2 border-primary/30">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Language
                  </Label>
                  <select
                    value={captionLang}
                    onChange={(e) => setCaptionLang(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none"
                    data-ocid="editor.caption_lang.select"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="pt">Portuguese</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Style
                  </Label>
                  <select
                    value={captionStyle}
                    onChange={(e) => setCaptionStyle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none"
                    data-ocid="editor.caption_style.select"
                  >
                    <option value="bold">Bold</option>
                    <option value="neon">Neon</option>
                    <option value="minimal">Minimal</option>
                    <option value="shadow">Shadow</option>
                  </select>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs h-7"
                disabled={processing}
                onClick={() => {
                  setProcessing(true);
                  setTimeout(() => {
                    setProcessing(false);
                    setCaptionMsg("Captions generated!");
                    toast.success(
                      `Captions generated in ${captionStyle} style!`,
                    );
                  }, 1400);
                }}
                data-ocid="editor.generate_captions.button"
              >
                {processing ? "Generating…" : captionMsg || "Generate Captions"}
              </Button>
            </div>
          )}
        </div>

        {/* Caption Translation */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Caption Translation
          </Label>
          <div className="flex gap-2">
            <select
              value={transLang}
              onChange={(e) => setTransLang(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none"
              data-ocid="editor.translation.select"
            >
              <option value="es">→ Spanish</option>
              <option value="fr">→ French</option>
              <option value="de">→ German</option>
              <option value="pt">→ Portuguese</option>
              <option value="ja">→ Japanese</option>
              <option value="ko">→ Korean</option>
            </select>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-8 px-3"
              onClick={() =>
                toast.success(`Translating captions to ${transLang}…`)
              }
              data-ocid="editor.translate.button"
            >
              Translate
            </Button>
          </div>
        </div>

        {/* Audio Ducking */}
        <ToggleRow
          label="Audio Ducking"
          value={audioDucking}
          onChange={(v) => {
            setAudioDucking(v);
            toast.success(
              v
                ? "Music will duck when speech is detected"
                : "Audio Ducking OFF",
            );
          }}
          description="Lower background music when speech is detected"
        />

        {/* Voiceover / TTS */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <div className="flex items-center gap-1">
            <Mic className="w-3.5 h-3.5 text-primary" />
            <Label className="text-xs text-muted-foreground">
              Voiceover / TTS <ProBadge />
            </Label>
          </div>
          <Textarea
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            placeholder="Type narration text here…"
            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs resize-none h-16"
            data-ocid="editor.tts.textarea"
          />
          <div className="flex gap-2">
            <select
              value={ttsVoice}
              onChange={(e) => setTtsVoice(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none"
              data-ocid="editor.tts_voice.select"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="energetic">Energetic</option>
              <option value="calm">Calm</option>
            </select>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-8 px-3"
              onClick={() =>
                ttsText
                  ? toast.success(`TTS: ${ttsVoice} voice queued`)
                  : toast.error("Enter some text first")
              }
              data-ocid="editor.tts_generate.button"
            >
              Generate
            </Button>
          </div>
        </div>

        {/* SRT Upload */}
        <div className="border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground block mb-2">
            SRT Upload
          </Label>
          <button
            type="button"
            className="w-full border-2 border-dashed border-white/15 rounded-lg p-3 text-center hover:border-primary/40 transition-colors cursor-pointer"
            onClick={() => toast.info("SRT file upload: select your .srt file")}
            data-ocid="editor.srt.upload_button"
          >
            <p className="text-xs text-muted-foreground">
              Drop .srt file here or click to upload
            </p>
          </button>
        </div>
      </div>
    </Panel>
  );
}

// ── CREATIVE & VISUALS PANEL ──────────────────────────────────────────────────

const TRANSITIONS = ["Glitch", "Whip-Pan", "Zoom", "Fade", "Wipe", "Spin"];
const GRADES = [
  "None",
  "Cinematic",
  "Vlog",
  "Horror",
  "Warm",
  "Cool",
  "Cyberpunk",
];
const STICKERS = [
  "🔥",
  "💯",
  "🎯",
  "⚡",
  "😂",
  "👀",
  "🚀",
  "💥",
  "🎮",
  "👑",
  "🎵",
  "❤️",
];

function CreativeVisualsPanel() {
  const [aspect, setAspect] = useState("16:9");
  const [grade, setGrade] = useState("None");
  const [keyframeZoom, setKeyframeZoom] = useState(false);
  const [zoomIntensity, setZoomIntensity] = useState([50]);
  const [transition, setTransition] = useState("");
  const [blur, setBlur] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [headerStyle, setHeaderStyle] = useState("breaking");
  const [headerText, setHeaderText] = useState("");
  const [splitLayout, setSplitLayout] = useState("side");
  const [masking, setMasking] = useState(false);
  const [gifQuery, setGifQuery] = useState("");
  const [lowerName, setLowerName] = useState("");
  const [lowerTitle, setLowerTitle] = useState("");

  return (
    <Panel
      title="Creative & Visuals"
      icon={<Palette className="w-3.5 h-3.5 text-primary" />}
    >
      <div className="space-y-4">
        {/* Video Resizer */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Video Resizer</Label>
          <div className="flex gap-2">
            {["16:9", "1:1", "9:16"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setAspect(r);
                  toast.success(`Aspect ratio: ${r}`);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  aspect === r
                    ? "bg-primary/20 text-primary border-primary/50"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                }`}
                data-ocid="editor.video_resizer.button"
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Color Grading */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Color Grading Preset
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGrade(g);
                  if (g !== "None") toast.success(`Color grade: ${g} applied`);
                }}
                className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                  grade === g
                    ? "bg-primary/20 text-primary border-primary/50"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                }`}
                data-ocid="editor.color_grade.button"
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Keyframe Animations */}
        <div className="space-y-2">
          <ToggleRow
            label="Keyframe Zoom-In on Face"
            value={keyframeZoom}
            onChange={(v) => {
              setKeyframeZoom(v);
              toast.success(v ? "Keyframe zoom enabled" : "Keyframe zoom OFF");
            }}
          />
          {keyframeZoom && (
            <div className="pl-3 space-y-1">
              <Label className="text-xs text-muted-foreground">
                Zoom Intensity: {zoomIntensity[0]}%
              </Label>
              <Slider
                value={zoomIntensity}
                onValueChange={setZoomIntensity}
                min={10}
                max={100}
                step={5}
                className="w-full"
                data-ocid="editor.zoom_intensity.toggle"
              />
            </div>
          )}
        </div>

        {/* Transitions Library */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Transitions Library
          </Label>
          <div className="grid grid-cols-3 gap-1.5">
            {TRANSITIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTransition(t);
                  toast.success(`Transition: ${t} selected`);
                }}
                className={`py-2 rounded-lg text-xs border transition-all ${
                  transition === t
                    ? "bg-primary/20 text-primary border-primary/50"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                }`}
                data-ocid="editor.transition.button"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Blur Tool */}
        <ToggleRow
          label="Blur Tool"
          value={blur}
          onChange={(v) => {
            setBlur(v);
            toast.success(
              v ? "Blur mode: drag to blur areas" : "Blur Tool OFF",
            );
          }}
          description="Hide sensitive info or faces"
        />

        {/* Custom Watermark */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <ToggleRow
            label="Custom Watermark"
            value={watermark}
            onChange={setWatermark}
            description="Overlay your brand logo on clips"
          />
          {watermark && (
            <button
              type="button"
              className="w-full border-2 border-dashed border-white/15 rounded-lg p-3 text-center cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() =>
                toast.info("Upload watermark image (PNG recommended)")
              }
              data-ocid="editor.watermark.upload_button"
            >
              <p className="text-xs text-muted-foreground">
                Upload watermark image
              </p>
            </button>
          )}
        </div>

        {/* Lower Thirds */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">Lower Thirds</Label>
          <Input
            value={lowerName}
            onChange={(e) => setLowerName(e.target.value)}
            placeholder="Name"
            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-8"
            data-ocid="editor.lower_thirds_name.input"
          />
          <Input
            value={lowerTitle}
            onChange={(e) => setLowerTitle(e.target.value)}
            placeholder="Title / Role"
            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-8"
            data-ocid="editor.lower_thirds_title.input"
          />
          {(lowerName || lowerTitle) && (
            <div className="bg-black/60 border border-white/15 rounded p-2">
              <p className="text-white text-sm font-bold">
                {lowerName || "Name"}
              </p>
              <p className="text-primary text-xs">{lowerTitle || "Title"}</p>
            </div>
          )}
        </div>

        {/* Animated Headers */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            Animated Headers
          </Label>
          <div className="flex gap-2">
            <select
              value={headerStyle}
              onChange={(e) => setHeaderStyle(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none"
              data-ocid="editor.header_style.select"
            >
              <option value="breaking">Breaking News</option>
              <option value="top5">Top 5</option>
              <option value="alert">Alert</option>
            </select>
            <Input
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="Header text…"
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-8"
              data-ocid="editor.header_text.input"
            />
          </div>
          {headerText && (
            <Button
              size="sm"
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs h-7"
              onClick={() => toast.success(`Header "${headerText}" added!`)}
              data-ocid="editor.add_header.button"
            >
              Add Header
            </Button>
          )}
        </div>

        {/* Split Screen Pro */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            Split Screen Pro
          </Label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              ["side", "Side-by-Side"],
              ["top", "Top-Bottom"],
              ["pip", "Picture-in-Picture"],
            ].map(([v, l]) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setSplitLayout(v);
                  toast.success(`Split: ${l}`);
                }}
                className={`py-1.5 rounded-lg text-xs border transition-all ${
                  splitLayout === v
                    ? "bg-primary/20 text-primary border-primary/50"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                }`}
                data-ocid="editor.split_screen.button"
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Masking Tool */}
        <ToggleRow
          label="Masking Tool"
          value={masking}
          onChange={(v) => {
            setMasking(v);
            toast.success(
              v
                ? "Masking: draw to reveal text from behind subject"
                : "Masking OFF",
            );
          }}
          description="Reveal text from behind a person"
        />

        {/* Sticker Library */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            Sticker Library
          </Label>
          <div className="flex flex-wrap gap-2">
            {STICKERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toast.success(`Sticker ${s} added to clip!`)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 text-base transition-all flex items-center justify-center"
                data-ocid="editor.sticker.button"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* GIPHY */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            GIPHY Integration
          </Label>
          <div className="flex gap-2">
            <Input
              value={gifQuery}
              onChange={(e) => setGifQuery(e.target.value)}
              placeholder="Search GIFs…"
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-8"
              data-ocid="editor.giphy.search_input"
            />
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-8 px-3"
              onClick={() =>
                gifQuery && toast.info(`Searching GIPHY for "${gifQuery}"…`)
              }
              data-ocid="editor.giphy.button"
            >
              Search
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {["😂 Funny", "🔥 Fire", "💯 Facts", "🚀 Epic"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toast.success(`GIF "${g}" added!`)}
                className="aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-muted-foreground hover:bg-primary/10 hover:border-primary/30 cursor-pointer transition-all"
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Image-to-Video */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            Image-to-Video Intro <ProBadge />
          </Label>
          <button
            type="button"
            className="w-full border-2 border-dashed border-white/15 rounded-lg p-3 text-center cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() =>
              toast.info("Upload a thumbnail to create animated intro")
            }
            data-ocid="editor.image_to_video.upload_button"
          >
            <ImagePlay className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">
              Upload thumbnail → animated intro
            </p>
          </button>
        </div>
      </div>
    </Panel>
  );
}

// ── EXPORT & DISTRIBUTION PANEL ───────────────────────────────────────────────

const PLATFORMS = [
  { id: "tiktok", label: "TikTok", spec: "9:16 · 1080×1920 · 60fps" },
  { id: "reels", label: "Reels", spec: "9:16 · 1080×1920 · 30fps" },
  { id: "shorts", label: "Shorts", spec: "9:16 · 1080×1920 · 60fps" },
  { id: "linkedin", label: "LinkedIn", spec: "16:9 · 1920×1080 · 30fps" },
];

function ExportDistributionPanel() {
  const [platform, setPlatform] = useState("");
  const [hookVariants, setHookVariants] = useState<string[]>([]);
  const [showSocialPreview, setShowSocialPreview] = useState(false);
  const [chapters, setChapters] = useState<string[]>([]);
  const [emojiRows, setEmojiRows] = useState<
    { keyword: string; emoji: string }[]
  >([
    { keyword: "fire", emoji: "🔥" },
    { keyword: "epic", emoji: "💥" },
  ]);
  const [cloudUrl, setCloudUrl] = useState("");
  const [cloudSource, setCloudSource] = useState("youtube");
  const [clipScore] = useState(78);
  const [presetName, setPresetName] = useState("");
  const [savedPresets, setSavedPresets] = useState<string[]>([
    "My TikTok Setup",
  ]);
  const [generating, setGenerating] = useState(false);

  const generateHooks = () => {
    setGenerating(true);
    setTimeout(() => {
      setHookVariants([
        '"I couldn\'t believe what happened next…"',
        '"This one thing changed EVERYTHING for me"',
        '"Nobody talks about this trick"',
      ]);
      setGenerating(false);
      toast.success("3 hook variants generated!");
    }, 1500);
  };

  const generateChapters = () => {
    setChapters([
      "0:00 Intro",
      "0:45 Main Point",
      "2:15 Deep Dive",
      "4:30 Takeaways",
      "5:50 Outro",
    ]);
    toast.success("Auto-chapters generated!");
  };

  const scoreColor =
    clipScore >= 80
      ? "text-green-400"
      : clipScore >= 60
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <Panel
      title="Export & Distribution"
      icon={<Share2 className="w-3.5 h-3.5 text-primary" />}
    >
      <div className="space-y-4">
        {/* Clip Score */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white font-semibold">
                Clip Score
              </span>
            </div>
            <span className={`text-2xl font-black ${scoreColor}`}>
              {clipScore}/100
            </span>
          </div>
          <Progress value={clipScore} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1.5">
            {clipScore >= 80
              ? "High viral potential!"
              : clipScore >= 60
                ? "Good engagement likely"
                : "Consider editing for better hooks"}
          </p>
        </div>

        {/* Multi-Platform Export */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Multi-Platform Export
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPlatform(p.id);
                  toast.success(`Export preset: ${p.label}`);
                }}
                className={`p-2 rounded-lg text-left border transition-all ${
                  platform === p.id
                    ? "bg-primary/20 border-primary/50"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
                data-ocid="editor.platform.button"
              >
                <p
                  className={`text-xs font-bold ${platform === p.id ? "text-primary" : "text-white"}`}
                >
                  {p.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {p.spec}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* A/B Hook Tester */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            A/B Hook Tester
          </Label>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/10 text-xs h-8"
            onClick={generateHooks}
            disabled={generating}
            data-ocid="editor.hook_tester.button"
          >
            {generating ? "Generating hooks…" : "Generate 3 Hook Variants"}
          </Button>
          {hookVariants.map((h, i) => (
            <div
              key={h}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/8"
            >
              <span className="text-xs text-primary font-bold w-4">
                {i + 1}.
              </span>
              <p className="text-xs text-white flex-1">{h}</p>
              <button
                type="button"
                onClick={() => toast.success("Hook copied!")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Copy
              </button>
            </div>
          ))}
        </div>

        {/* Social Preview */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Social Preview (TikTok UI)
            </Label>
            <button
              type="button"
              onClick={() => setShowSocialPreview(!showSocialPreview)}
              className="text-xs text-primary hover:text-primary/80"
              data-ocid="editor.social_preview.button"
            >
              {showSocialPreview ? "Hide" : "Show"}
            </button>
          </div>
          {showSocialPreview && (
            <div className="relative w-32 mx-auto aspect-[9/16] bg-black rounded-xl overflow-hidden border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              <div className="absolute bottom-4 left-2 right-2">
                <p className="text-white text-[8px] font-bold">
                  @beastclipping
                </p>
                <p className="text-white text-[7px] mt-0.5">
                  Check out this crazy clip! 🔥
                </p>
              </div>
              <div className="absolute right-2 bottom-12 flex flex-col gap-3 items-center">
                <div className="text-center">
                  <div className="text-base">❤️</div>
                  <p className="text-white text-[7px]">12.3K</p>
                </div>
                <div className="text-center">
                  <div className="text-base">💬</div>
                  <p className="text-white text-[7px]">847</p>
                </div>
                <div className="text-center">
                  <div className="text-base">↗️</div>
                  <p className="text-white text-[7px]">Share</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Auto-Chapters */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Auto-Chapters
            </Label>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-7 px-3"
              onClick={generateChapters}
              data-ocid="editor.auto_chapters.button"
            >
              Generate
            </Button>
          </div>
          {chapters.length > 0 && (
            <div className="space-y-1">
              {chapters.map((c) => (
                <p key={c} className="text-xs text-muted-foreground font-mono">
                  {c}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Emoji Triggers */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            Emoji Triggers
          </Label>
          <div className="space-y-1.5">
            {emojiRows.map((row, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: emoji rows are reordered by user
              <div key={`emoji-${i}`} className="flex items-center gap-2">
                <Input
                  value={row.keyword}
                  onChange={(e) => {
                    const next = [...emojiRows];
                    next[i].keyword = e.target.value;
                    setEmojiRows(next);
                  }}
                  placeholder="keyword"
                  className="flex-1 bg-white/5 border-white/10 text-white text-xs h-7 placeholder:text-muted-foreground"
                  data-ocid="editor.emoji_trigger.input"
                />
                <Input
                  value={row.emoji}
                  onChange={(e) => {
                    const next = [...emojiRows];
                    next[i].emoji = e.target.value;
                    setEmojiRows(next);
                  }}
                  placeholder="emoji"
                  className="w-16 bg-white/5 border-white/10 text-white text-xs h-7 text-center"
                />
                <button
                  type="button"
                  onClick={() =>
                    setEmojiRows(emojiRows.filter((_, j) => j !== i))
                  }
                  className="text-red-400 hover:text-red-300 text-xs"
                  data-ocid="editor.emoji_trigger.delete_button"
                >
                  ✕
                </button>
              </div>
            ))}
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-primary hover:bg-primary/10 h-7 w-full"
              onClick={() =>
                setEmojiRows([...emojiRows, { keyword: "", emoji: "" }])
              }
              data-ocid="editor.emoji_trigger.button"
            >
              + Add trigger
            </Button>
          </div>
        </div>

        {/* Cloud Import */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">Cloud Import</Label>
          <div className="flex gap-2">
            <select
              value={cloudSource}
              onChange={(e) => setCloudSource(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none"
              data-ocid="editor.cloud_source.select"
            >
              <option value="youtube">YouTube</option>
              <option value="twitch">Twitch</option>
              <option value="gdrive">Google Drive</option>
            </select>
            <Input
              value={cloudUrl}
              onChange={(e) => setCloudUrl(e.target.value)}
              placeholder="Paste URL…"
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-8"
              data-ocid="editor.cloud_import.input"
            />
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-8 px-3"
              onClick={() =>
                cloudUrl
                  ? toast.success(`Importing from ${cloudSource}…`)
                  : toast.error("Paste a URL first")
              }
              data-ocid="editor.cloud_import.button"
            >
              Import
            </Button>
          </div>
        </div>

        {/* Export Presets */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            Export Presets
          </Label>
          <div className="flex gap-2">
            <Input
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name…"
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-8"
              data-ocid="editor.export_preset.input"
            />
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-8 px-3"
              onClick={() => {
                if (presetName.trim()) {
                  setSavedPresets([...savedPresets, presetName.trim()]);
                  setPresetName("");
                  toast.success("Preset saved!");
                }
              }}
              data-ocid="editor.save_preset.button"
            >
              Save
            </Button>
          </div>
          {savedPresets.map((p, i) => (
            <div
              key={p}
              className="flex items-center justify-between py-1.5 px-2 bg-white/5 rounded-lg"
            >
              <span className="text-xs text-white">{p}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toast.success(`Applied preset: ${p}`)}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSavedPresets(savedPresets.filter((_, j) => j !== i))
                  }
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ── WORKFLOW PANEL ────────────────────────────────────────────────────────────

const TEMPLATES = [
  { id: "podcast", label: "Podcast", emoji: "🎙️" },
  { id: "interview", label: "Interview", emoji: "🎤" },
  { id: "reaction", label: "Reaction", emoji: "😱" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "vlog", label: "Vlog", emoji: "📹" },
];

function WorkflowPanel() {
  const [turboMode, setTurboMode] = useState(false);
  const [brollMsg, setBrollMsg] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [brandKits, setBrandKits] = useState([
    { name: "Default Brand", color: "#00f2ff", font: "Satoshi" },
  ]);
  const [newBrandName, setNewBrandName] = useState("");
  const [versionHistory] = useState([
    { id: 1, ts: "2 min ago", label: "After silence removal" },
    { id: 2, ts: "15 min ago", label: "Initial edit" },
    { id: 3, ts: "1 hr ago", label: "Original upload" },
  ]);
  const [smartSentences] = useState([
    "Welcome back to the channel, today we're going to be talking about...",
    "I was absolutely blown away by how this turned out",
    "You won't believe what happened next in this clip",
  ]);
  const [deletedSentences, setDeletedSentences] = useState<number[]>([]);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    { ts: "0:12", text: "Great opening hook!" },
  ]);
  const [commentTs, setCommentTs] = useState("0:00");

  return (
    <Panel
      title="Workflow & Productivity"
      icon={<Rocket className="w-3.5 h-3.5 text-primary" />}
    >
      <div className="space-y-4">
        {/* Auto-Save Status */}
        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <Save className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-300 font-medium">
              Draft Auto-Saved
            </span>
          </div>
          <span className="text-xs text-muted-foreground">2 min ago</span>
        </div>

        {/* Progressive Loading */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white">Progressive Loading</span>
            <span className="text-xs text-primary font-semibold">
              Ready to edit: 72%
            </span>
          </div>
          <Progress value={72} className="h-1.5" />
        </div>

        {/* Turbo Mode */}
        <ToggleRow
          label="Turbo Mode"
          value={turboMode}
          onChange={(v) => {
            setTurboMode(v);
            toast.success(
              v
                ? "⚡ Turbo Mode: high-speed rendering active!"
                : "Turbo Mode OFF",
            );
          }}
          description="Priority rendering queue for faster exports"
          pro
        />

        {/* B-Roll Generator */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">B-Roll Generator</p>
              <p className="text-xs text-muted-foreground">
                Suggests stock footage from transcript
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-7 px-3"
              onClick={() => {
                setBrollMsg("gaming, reaction, highlight, esports, crowd");
                toast.success("B-Roll keywords extracted!");
              }}
              data-ocid="editor.broll.button"
            >
              Generate
            </Button>
          </div>
          {brollMsg && (
            <div className="bg-white/5 rounded-lg p-2 border border-white/8">
              <p className="text-xs text-muted-foreground mb-1">
                Suggested keywords:
              </p>
              <div className="flex flex-wrap gap-1">
                {brollMsg.split(", ").map((k) => (
                  <span
                    key={k}
                    className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full border border-primary/20"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Template Library */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            Template Library
          </Label>
          <div className="grid grid-cols-5 gap-1.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setSelectedTemplate(t.id);
                  toast.success(`Template: ${t.label} applied`);
                }}
                className={`py-2 rounded-lg text-center border transition-all flex flex-col items-center gap-0.5 ${
                  selectedTemplate === t.id
                    ? "bg-primary/20 border-primary/50"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
                data-ocid="editor.template.button"
              >
                <span className="text-sm">{t.emoji}</span>
                <span className="text-[10px] text-muted-foreground">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Brand Kits */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">Brand Kits</Label>
          {brandKits.map((kit) => (
            <div
              key={kit.name}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/8"
            >
              <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: kit.color }}
              />
              <span className="text-xs text-white flex-1">{kit.name}</span>
              <span className="text-xs text-muted-foreground">{kit.font}</span>
              <button
                type="button"
                onClick={() =>
                  toast.success(`Brand kit "${kit.name}" applied!`)
                }
                className="text-xs text-primary hover:text-primary/80"
                data-ocid="editor.brand_kit.button"
              >
                Apply
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="New brand name…"
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-7"
            />
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-primary hover:bg-primary/10 h-7 px-3"
              onClick={() => {
                if (newBrandName.trim()) {
                  setBrandKits([
                    ...brandKits,
                    {
                      name: newBrandName.trim(),
                      color: "#00f2ff",
                      font: "Satoshi",
                    },
                  ]);
                  setNewBrandName("");
                  toast.success("Brand kit created!");
                }
              }}
              data-ocid="editor.brand_kit.save_button"
            >
              + Create
            </Button>
          </div>
        </div>

        {/* Smart Trimming */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            Smart Trimming — Delete by transcript
          </Label>
          <div className="space-y-1.5">
            {smartSentences.map(
              (s, i) =>
                !deletedSentences.includes(i) && (
                  <div
                    key={s.slice(0, 20)}
                    className="flex items-start gap-2 p-2 bg-white/5 rounded-lg border border-white/8 group"
                  >
                    <p className="text-xs text-white flex-1 leading-relaxed">
                      {s}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDeletedSentences([...deletedSentences, i]);
                        toast.success("Segment deleted from video");
                      }}
                      className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                      title="Delete this segment"
                      data-ocid="editor.smart_trim.delete_button"
                    >
                      ✕
                    </button>
                  </div>
                ),
            )}
            {deletedSentences.length === smartSentences.length && (
              <p className="text-xs text-muted-foreground text-center py-2">
                All segments processed
              </p>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="border-t border-white/8 pt-3">
          <button
            type="button"
            onClick={() => setShortcutsOpen(!shortcutsOpen)}
            className="flex items-center gap-2 text-sm text-white hover:text-primary transition-colors"
            data-ocid="editor.shortcuts.button"
          >
            <Keyboard className="w-4 h-4" />
            Keyboard Shortcuts
            {shortcutsOpen ? (
              <ChevronUp className="w-3 h-3 ml-auto" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-auto" />
            )}
          </button>
          {shortcutsOpen && (
            <div className="mt-2 space-y-1">
              {[
                ["J", "Rewind 10s"],
                ["K", "Play / Pause"],
                ["L", "Forward 10s"],
                ["I", "Set In Point"],
                ["O", "Set Out Point"],
                ["Space", "Toggle Play"],
                ["Ctrl+S", "Save Clip"],
                ["Ctrl+Z", "Undo"],
              ].map(([key, action]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-xs text-muted-foreground">
                    {action}
                  </span>
                  <kbd className="text-xs bg-white/10 text-white px-2 py-0.5 rounded font-mono border border-white/15">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Version History */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Version History
          </Label>
          {versionHistory.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between py-1.5 px-2 bg-white/5 rounded-lg"
            >
              <div>
                <p className="text-xs text-white">{v.label}</p>
                <p className="text-xs text-muted-foreground">{v.ts}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-primary hover:bg-primary/10 h-6 px-2"
                onClick={() => toast.success(`Restored: ${v.label}`)}
                data-ocid="editor.version_history.button"
              >
                Restore
              </Button>
            </div>
          ))}
        </div>

        {/* Video Commenting */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <Label className="text-xs text-muted-foreground">
            Video Commenting (for clients)
          </Label>
          <div className="space-y-1.5">
            {comments.map((c) => (
              <div
                key={`${c.ts}-${c.text.slice(0, 10)}`}
                className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/8"
              >
                <span className="text-xs text-primary font-mono flex-shrink-0">
                  {c.ts}
                </span>
                <p className="text-xs text-white flex-1">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5">
            <Input
              value={commentTs}
              onChange={(e) => setCommentTs(e.target.value)}
              placeholder="0:00"
              className="w-16 bg-white/5 border-white/10 text-white text-xs h-7 font-mono"
            />
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a note…"
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-7"
              data-ocid="editor.video_comment.input"
            />
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-primary hover:bg-primary/10 h-7 px-2"
              onClick={() => {
                if (commentText.trim()) {
                  setComments([
                    ...comments,
                    { ts: commentTs, text: commentText.trim() },
                  ]);
                  setCommentText("");
                  toast.success("Comment added!");
                }
              }}
              data-ocid="editor.add_comment.button"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────

export default function EditorToolsPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-primary" />
        <h2 className="text-white font-bold text-sm">Advanced Editor Tools</h2>
        <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px]">
          AI-Powered
        </Badge>
      </div>
      <AIToolsPanel />
      <CaptionsAudioPanel />
      <CreativeVisualsPanel />
      <ExportDistributionPanel />
      <WorkflowPanel />
    </div>
  );
}

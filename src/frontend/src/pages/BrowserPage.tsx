import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Globe,
  Home,
  RefreshCw,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useRef, useState } from "react";

const START_URL = "";

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^localhost|^\d{1,3}\./i.test(trimmed)) return `http://${trimmed}`;
  // looks like a domain
  if (/^[\w-]+\.[\w.-]+/i.test(trimmed)) return `https://${trimmed}`;
  // treat as search
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

export default function BrowserPage() {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputUrl, setInputUrl] = useState("");
  const [loadedUrl, setLoadedUrl] = useState(START_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentUrl = history[historyIndex] ?? "";
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const navigate = useCallback(
    (url: string) => {
      if (!url) return;
      const normalized = normalizeUrl(url);
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(normalized);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
      setLoadedUrl(normalized);
      setInputUrl(normalized);
      setIsLoading(true);
    },
    [historyIndex],
  );

  const handleGo = () => {
    navigate(inputUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGo();
    if (e.key === "Escape") setInputUrl(currentUrl);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const url = history[newIndex];
    setLoadedUrl(url);
    setInputUrl(url);
    setIsLoading(true);
  };

  const handleForward = () => {
    if (!canGoForward) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const url = history[newIndex];
    setLoadedUrl(url);
    setInputUrl(url);
    setIsLoading(true);
  };

  const handleRefresh = () => {
    if (!loadedUrl) return;
    // Force reload by briefly clearing and re-setting
    const url = loadedUrl;
    setLoadedUrl("");
    setIsLoading(true);
    setTimeout(() => setLoadedUrl(url), 50);
  };

  const handleHome = () => {
    setLoadedUrl("");
    setInputUrl("");
    setHistory([]);
    setHistoryIndex(-1);
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    // Try to read title/URL from iframe (may be blocked by CSP)
    try {
      const iframeDoc = iframeRef.current?.contentDocument;
      if (
        iframeDoc?.location?.href &&
        iframeDoc.location.href !== "about:blank"
      ) {
        setInputUrl(iframeDoc.location.href);
      }
    } catch {
      // Cross-origin — can't read, keep current
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setInputFocused(true);
    e.target.select();
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 0px)", minHeight: 0 }}
    >
      {/* Warning Banner */}
      <AnimatePresence>
        {!warningDismissed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-300/80 border-b"
            style={{
              background: "oklch(0.25 0.06 80 / 0.3)",
              borderColor: "oklch(0.75 0.15 80 / 0.2)",
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
            <span className="flex-1">
              Some websites (like Google, YouTube) block embedding. If a site
              doesn't load, try entering the URL directly in your browser.
            </span>
            <button
              type="button"
              onClick={() => setWarningDismissed(true)}
              className="p-0.5 rounded hover:bg-white/10 text-amber-300/60 hover:text-amber-300 transition-colors"
              data-ocid="browser.close_button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b flex-shrink-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.04 200 / 0.8) 0%, oklch(0.1 0.03 290 / 0.9) 100%)",
          backdropFilter: "blur(20px)",
          borderColor: "oklch(0.88 0.17 200 / 0.12)",
        }}
      >
        {/* Nav buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleBack}
            disabled={!canGoBack}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/8 text-muted-foreground hover:text-primary"
            title="Back"
            data-ocid="browser.button"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleForward}
            disabled={!canGoForward}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/8 text-muted-foreground hover:text-primary"
            title="Forward"
            data-ocid="browser.button"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={!loadedUrl}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/8 text-muted-foreground hover:text-primary"
            title="Refresh"
            data-ocid="browser.button"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={handleHome}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/8 text-muted-foreground hover:text-primary"
            title="Home"
            data-ocid="browser.button"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Address bar */}
        <div className="flex-1 flex items-center gap-2">
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-3 py-1.5 border transition-all duration-200"
            style={{
              background: inputFocused
                ? "oklch(0.14 0.04 200 / 0.9)"
                : "oklch(0.11 0.02 200 / 0.7)",
              borderColor: inputFocused
                ? "oklch(0.88 0.17 200 / 0.5)"
                : "oklch(0.88 0.17 200 / 0.12)",
              boxShadow: inputFocused
                ? "0 0 0 2px oklch(0.88 0.17 200 / 0.12), 0 0 16px oklch(0.88 0.17 200 / 0.1)"
                : "none",
            }}
          >
            <Globe className="w-3.5 h-3.5 text-primary/50 flex-shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={() => setInputFocused(false)}
              placeholder="Enter a URL or search term..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/50 min-w-0"
              spellCheck={false}
              autoComplete="off"
              data-ocid="browser.input"
            />
            {inputUrl && (
              <button
                type="button"
                onClick={() => setInputUrl("")}
                className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <Button
            onClick={handleGo}
            size="sm"
            className="px-4 h-8 text-xs font-bold rounded-xl border transition-all"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.88 0.17 200 / 0.2) 0%, oklch(0.88 0.17 200 / 0.1) 100%)",
              borderColor: "oklch(0.88 0.17 200 / 0.35)",
              color: "oklch(0.88 0.17 200)",
              boxShadow: "0 0 12px oklch(0.88 0.17 200 / 0.12)",
            }}
            data-ocid="browser.primary_button"
          >
            Go
          </Button>
        </div>
      </div>

      {/* Browser Content Area */}
      <div className="flex-1 relative" style={{ minHeight: 0 }}>
        {loadedUrl ? (
          <>
            {/* Loading indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 0.9 }}
                  exit={{ scaleX: 1, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-0 left-0 right-0 h-0.5 origin-left z-10"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.88 0.17 200), oklch(0.7 0.15 180))",
                    boxShadow: "0 0 8px oklch(0.88 0.17 200 / 0.6)",
                  }}
                />
              )}
            </AnimatePresence>
            <iframe
              ref={iframeRef}
              src={loadedUrl}
              onLoad={handleIframeLoad}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              title="In-App Browser"
              className="w-full h-full border-none"
              style={{ display: "block", background: "#fff" }}
            />
          </>
        ) : (
          /* Start Page */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col items-center justify-center p-8"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, oklch(0.15 0.06 200 / 0.4) 0%, transparent 70%)",
            }}
          >
            {/* Glow orb */}
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.88 0.17 200 / 0.06) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full text-center">
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center border"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.88 0.17 200 / 0.15) 0%, oklch(0.88 0.17 200 / 0.05) 100%)",
                    borderColor: "oklch(0.88 0.17 200 / 0.25)",
                    boxShadow:
                      "0 0 40px oklch(0.88 0.17 200 / 0.12), inset 0 1px 0 oklch(0.88 0.17 200 / 0.1)",
                  }}
                >
                  <Globe
                    className="w-9 h-9 text-primary"
                    style={{
                      filter: "drop-shadow(0 0 8px oklch(0.88 0.17 200 / 0.6))",
                    }}
                  />
                </div>
                <div>
                  <h1
                    className="font-display font-black text-3xl tracking-tight"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.95 0.015 200) 0%, oklch(0.88 0.17 200) 60%, oklch(0.78 0.17 200) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    In-App Browser
                  </h1>
                  <p className="text-muted-foreground text-sm mt-2">
                    Browse any website within Beast Clipping
                  </p>
                </div>
              </div>

              {/* Quick links */}
              <div className="w-full space-y-3">
                <p className="text-muted-foreground/60 text-xs uppercase tracking-widest">
                  Quick Access
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "YouTube",
                      url: "https://youtube.com",
                      emoji: "📺",
                    },
                    { label: "Twitter / X", url: "https://x.com", emoji: "𝕏" },
                    { label: "TikTok", url: "https://tiktok.com", emoji: "🎵" },
                    { label: "Reddit", url: "https://reddit.com", emoji: "🤖" },
                    { label: "Twitch", url: "https://twitch.tv", emoji: "🟣" },
                    {
                      label: "Discord",
                      url: "https://discord.com",
                      emoji: "💬",
                    },
                  ].map((link) => (
                    <button
                      key={link.url}
                      type="button"
                      onClick={() => {
                        setInputUrl(link.url);
                        navigate(link.url);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: "oklch(0.11 0.03 200 / 0.6)",
                        borderColor: "oklch(0.88 0.17 200 / 0.1)",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = "oklch(0.88 0.17 200 / 0.3)";
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "oklch(0.14 0.04 200 / 0.8)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = "oklch(0.88 0.17 200 / 0.1)";
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "oklch(0.11 0.03 200 / 0.6)";
                      }}
                      data-ocid="browser.button"
                    >
                      <span className="text-xl leading-none">{link.emoji}</span>
                      <span className="text-foreground/80">{link.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-muted-foreground/40 text-xs">
                Type a URL or search term in the address bar above and press{" "}
                <kbd
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono border"
                  style={{
                    borderColor: "oklch(0.88 0.17 200 / 0.2)",
                    background: "oklch(0.88 0.17 200 / 0.08)",
                    color: "oklch(0.88 0.17 200 / 0.6)",
                  }}
                >
                  Enter
                </kbd>{" "}
                to browse
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

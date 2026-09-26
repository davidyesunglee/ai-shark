import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Square, Minus, Plus, Type, Accessibility, X } from "lucide-react";

const FONT_SIZES = [
  { label: "Small", value: 14 },
  { label: "Default", value: 16 },
  { label: "Large", value: 18 },
  { label: "Extra Large", value: 20 },
];

const FONT_SIZE_KEY = "accessibility-font-size";
const PANEL_ID = "accessibility-panel";

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(1);
  const [speechSupported, setSpeechSupported] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSpeechSupported("speechSynthesis" in window);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    if (saved !== null) {
      const idx = parseInt(saved, 10);
      if (idx >= 0 && idx < FONT_SIZES.length) {
        setFontSizeIndex(idx);
        document.documentElement.style.fontSize = `${FONT_SIZES[idx].value}px`;
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      panelRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const changeFontSize = useCallback((direction: "increase" | "decrease") => {
    setFontSizeIndex((prev) => {
      const next = direction === "increase" ? Math.min(prev + 1, FONT_SIZES.length - 1) : Math.max(prev - 1, 0);
      document.documentElement.style.fontSize = `${FONT_SIZES[next].value}px`;
      localStorage.setItem(FONT_SIZE_KEY, String(next));
      return next;
    });
  }, []);

  const getReadableContent = useCallback((): string => {
    const main = document.querySelector("main") || document.querySelector("#main-content");
    if (!main) return document.body.innerText.substring(0, 5000);

    const skipTags = new Set(["script", "style", "noscript", "button", "nav", "select", "input", "textarea"]);

    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (skipTags.has(tag)) return NodeFilter.FILTER_REJECT;
        if (parent.closest("[aria-hidden='true']")) return NodeFilter.FILTER_REJECT;
        if (parent.closest("nav")) return NodeFilter.FILTER_REJECT;
        const text = node.textContent?.trim();
        if (!text) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const parts: string[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text) parts.push(text);
    }
    return parts.join(". ").substring(0, 10000);
  }, []);

  const startSpeech = useCallback(() => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();

    const text = getReadableContent();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  }, [speechSupported, getReadableContent]);

  const togglePause = useCallback(() => {
    if (!speechSupported) return;
    if (!window.speechSynthesis.speaking) {
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [speechSupported]);

  const stopSpeech = useCallback(() => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [speechSupported]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div ref={toolbarRef} className="fixed bottom-4 right-4 z-50" data-testid="accessibility-toolbar">
      <Button
        ref={toggleRef}
        size="icon"
        variant="default"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close accessibility toolbar" : "Open accessibility toolbar"}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        data-testid="button-accessibility-toggle"
        className="rounded-full shadow-lg"
      >
        <Accessibility className="h-5 w-5" aria-hidden="true" />
      </Button>

      {isOpen && (
        <div
          ref={panelRef}
          id={PANEL_ID}
          tabIndex={-1}
          className="absolute bottom-14 right-0 w-72 rounded-lg border bg-background shadow-xl p-4 space-y-4 outline-none"
          role="region"
          aria-label="Accessibility controls"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Accessibility className="h-4 w-4" aria-hidden="true" />
              Accessibility Tools
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
                toggleRef.current?.focus();
              }}
              aria-label="Close accessibility toolbar"
              data-testid="button-accessibility-close"
              className="h-6 w-6 p-0"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium">Font Size</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => changeFontSize("decrease")}
                disabled={fontSizeIndex === 0}
                aria-label="Decrease font size"
                data-testid="button-font-decrease"
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" aria-hidden="true" />
              </Button>
              <div
                className="flex-1 text-center text-sm font-medium"
                aria-live="polite"
                data-testid="text-font-size"
              >
                {FONT_SIZES[fontSizeIndex].label} ({FONT_SIZES[fontSizeIndex].value}px)
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => changeFontSize("increase")}
                disabled={fontSizeIndex === FONT_SIZES.length - 1}
                aria-label="Increase font size"
                data-testid="button-font-increase"
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
              </Button>
            </div>
            <div
              className="w-full bg-muted rounded-full h-1.5"
              role="progressbar"
              aria-valuenow={FONT_SIZES[fontSizeIndex].value}
              aria-valuemin={FONT_SIZES[0].value}
              aria-valuemax={FONT_SIZES[FONT_SIZES.length - 1].value}
              aria-valuetext={`${FONT_SIZES[fontSizeIndex].label}, ${FONT_SIZES[fontSizeIndex].value} pixels`}
              aria-label="Font size level"
            >
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${(fontSizeIndex / (FONT_SIZES.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {speechSupported && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Read Aloud</span>
              </div>
              {!isSpeaking ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={startSpeech}
                  className="w-full"
                  aria-label="Read page content aloud"
                  data-testid="button-start-speech"
                >
                  <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Read Page Content
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={togglePause}
                    className="flex-1"
                    aria-label={isPaused ? "Resume reading" : "Pause reading"}
                    data-testid="button-pause-speech"
                  >
                    {isPaused ? (
                      <>
                        <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" />
                        Resume
                      </>
                    ) : (
                      <>
                        <VolumeX className="h-4 w-4 mr-2" aria-hidden="true" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={stopSpeech}
                    aria-label="Stop reading"
                    data-testid="button-stop-speech"
                  >
                    <Square className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              )}
              {isSpeaking && (
                <p className="text-xs text-muted-foreground" aria-live="polite">
                  {isPaused ? "Reading paused" : "Reading page content..."}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

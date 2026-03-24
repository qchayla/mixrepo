import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Copy, RotateCcw } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { promptLibrary, getBusinessTypes } from "@/data/ai-guide";
import { toast } from "sonner";

const guideSteps = [
  {
    label: "1. Copy the prompt",
    gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTJ3NXJ4dGJ4eHRnZzJ5OGpjYjVxd2k1ZWF6OWRyeGQzMnFsYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNQ03J5JR3m0ZG/giphy.gif",
    color: "from-violet-500/30 to-purple-600/30",
    border: "border-violet-500/40",
  },
  {
    label: "2. Open your AI platform",
    gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnl5cWxuaG1pN2NvdXIxMjdkOGt2NjFqZmZ5MWNhbjhicnN5eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6H6/giphy.gif",
    color: "from-blue-500/30 to-cyan-600/30",
    border: "border-blue-500/40",
  },
  {
    label: "3. Paste & customize",
    gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXo0c2M1OHNyNm5sN2g2aGJ3NTQ2dnJ5cGJhcGpnZjM5OGFtYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif",
    color: "from-emerald-500/30 to-teal-600/30",
    border: "border-emerald-500/40",
  },
  {
    label: "4. Deploy & share",
    gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2lxZjdnbGh3OGl6NHJ4dXlnNTduMDMyMXdqOTVncTU2bG9lMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif",
    color: "from-coral/30 to-orange-500/30",
    border: "border-coral/40",
  },
];

const STEP_DELAY = 600; // ms between each card appearing

const AiGuide = () => {
  const navigate = useNavigate();
  const [businessFilter, setBusinessFilter] = useState<string | null>(null);
  const [visibleStep, setVisibleStep] = useState(-1);
  const [allRevealed, setAllRevealed] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const businessTypes = getBusinessTypes();

  const filteredPrompts = businessFilter
    ? promptLibrary.filter((p) => p.businessType === businessFilter)
    : promptLibrary;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Sequential reveal animation
  const startSequence = useCallback(() => {
    // Clear any existing timers
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setVisibleStep(-1);
    setAllRevealed(false);

    guideSteps.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleStep(i);
        if (i === guideSteps.length - 1) {
          const done = setTimeout(() => setAllRevealed(true), 500);
          timerRef.current.push(done);
        }
      }, (i + 1) * STEP_DELAY);
      timerRef.current.push(t);
    });
  }, []);

  useEffect(() => {
    startSequence();
    return () => timerRef.current.forEach(clearTimeout);
  }, [startSequence, playKey]);

  const handleReplay = () => {
    setPlayKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div
        className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/50 px-4 py-3"
        style={{ background: "hsl(var(--glass-bg))" }}
      >
        <button
          className="flex items-center gap-2 text-sm font-medium text-foreground active:opacity-70"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back to Tools
        </button>
      </div>

      <div className="px-4 py-4">
        <h1 className="text-lg font-semibold font-display gradient-text">
          AI Deployment Guide
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          4 steps to deploy any tool with AI.
        </p>

        {/* Stacked GIF cards */}
        <div
          className="relative mt-6 mx-auto"
          style={{ height: 340, perspective: "1200px" }}
        >
          {guideSteps.map((step, i) => {
            const isVisible = i <= visibleStep;
            const reverseIndex = guideSteps.length - 1 - i;

            // Final fanned-out position
            const fanZ = reverseIndex * -30;
            const fanY = reverseIndex * 6;

            return (
              <div
                key={`${playKey}-${i}`}
                className={`absolute inset-0 rounded-2xl overflow-hidden border ${step.border} bg-gradient-to-br ${step.color} backdrop-blur-sm`}
                style={{
                  transformOrigin: "center bottom",
                  transform: isVisible
                    ? allRevealed
                      ? `translateZ(${fanZ}px) translateY(${fanY}px) rotateX(0deg)`
                      : "translateZ(0px) translateY(0px) rotateX(0deg)"
                    : "translateZ(0px) translateY(40px) rotateX(-90deg)",
                  opacity: isVisible ? (allRevealed ? 1 - reverseIndex * 0.06 : 1) : 0,
                  transition: isVisible
                    ? allRevealed
                      ? `transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1) ${reverseIndex * 100}ms, opacity 400ms ease ${reverseIndex * 80}ms`
                      : "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease"
                    : "none",
                  zIndex: i + 1,
                  transformStyle: "preserve-3d",
                }}
              >
                <img
                  src={step.gif}
                  alt={step.label}
                  className="w-full h-full object-cover"
                />
                {/* Label overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="text-white text-sm font-semibold font-display drop-shadow-lg">
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Replay button */}
        {allRevealed && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleReplay}
              className="flex items-center gap-2 text-xs px-4 py-2 rounded-full glass font-medium text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            >
              <RotateCcw size={13} />
              Replay
            </button>
          </div>
        )}

        {/* Prompt Library */}
        <h2 className="text-base font-semibold mt-8 mb-1">Prompt Library</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Ready-to-use prompts for common business tools
        </p>

        {/* Business type filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          <button
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium shrink-0 transition-colors ${
              !businessFilter
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => setBusinessFilter(null)}
          >
            All
          </button>
          {businessTypes.map((type) => (
            <button
              key={type}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium shrink-0 transition-colors capitalize ${
                businessFilter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() =>
                setBusinessFilter(businessFilter === type ? null : type)
              }
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-card rounded-lg border border-border p-4"
            >
              <h3 className="text-sm font-medium">{prompt.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {prompt.useCase}
              </p>
              <pre className="mt-3 bg-secondary rounded-lg p-3 text-xs text-secondary-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {prompt.prompt}
              </pre>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-muted-foreground italic">
                  Edit before pasting
                </span>
                <button
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium active:scale-95 transition-transform"
                  onClick={() => handleCopy(prompt.prompt)}
                >
                  <Copy size={11} />
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AiGuide;

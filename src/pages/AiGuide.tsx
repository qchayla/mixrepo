import { useState } from "react";
import { ArrowLeft, Copy, Clipboard } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { platforms, promptLibrary, getBusinessTypes } from "@/data/ai-guide";
import { toast } from "sonner";

const AiGuide = () => {
  const navigate = useNavigate();
  const [businessFilter, setBusinessFilter] = useState<string | null>(null);
  const businessTypes = getBusinessTypes();

  const filteredPrompts = businessFilter
    ? promptLibrary.filter((p) => p.businessType === businessFilter)
    : promptLibrary;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <button
          className="flex items-center gap-2 text-sm font-medium text-foreground active:opacity-70"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back to Tools
        </button>
      </div>

      <div className="px-4 py-4">
        <h1 className="text-lg font-semibold">AI Deployment Guide</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pick your platform, paste the prompt, and deploy in minutes.
        </p>

        {/* Platform cards */}
        <div className="flex flex-col gap-3 mt-5">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-card rounded-lg border border-border p-4"
            >
              <h3 className="text-sm font-semibold">{platform.name}</h3>
              <ol className="mt-3 space-y-2">
                {platform.steps.map((step, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground flex gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-semibold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <button
                className="mt-3 flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium active:scale-95 transition-transform w-full justify-center"
                onClick={() => handleCopy(platform.starterPrompt)}
              >
                <Clipboard size={12} />
                Copy Starter Prompt
              </button>
            </div>
          ))}
        </div>

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
                  ✏️ Edit before pasting
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

      {/* Bottom padding */}
      <div className="h-8" />
    </div>
  );
};

export default AiGuide;

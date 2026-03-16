import { Heart, Eye, Copy } from "lucide-react";
import { AppMeta } from "@/data/apps";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ToolCardProps {
  app: AppMeta;
  isLiked: boolean;
  onTap: (app: AppMeta) => void;
  onHeart: (appId: string) => void;
  hearts: number;
  tryouts: number;
}

const typeColors: Record<string, string> = {
  Hot: "bg-coral/10 text-coral",
  New: "bg-primary/10 text-primary",
  "Editor Choice": "bg-accent/10 text-accent",
};

const ToolCard = ({ app, isLiked, onTap, onHeart, hearts, tryouts }: ToolCardProps) => {
  const navigate = useNavigate();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `Pull this GitHub repo and deploy it for me: ${app.repo}`
    );
    toast.success("Prompt copied! Paste into your AI agent", {
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="bg-card rounded-lg border border-border overflow-hidden active:scale-[0.98] transition-transform duration-100 cursor-pointer"
        onClick={() => onTap(app)}
      >
        {/* Thumbnail */}
        <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
          <span className="text-3xl">
            {app.id === "stock-tracker" ? "📦" :
             app.id === "invoice-maker" ? "🧾" :
             app.id === "shift-scheduler" ? "📅" :
             app.id === "expense-log" ? "💰" :
             app.id === "menu-builder" ? "🍽️" :
             app.id === "attendance-app" ? "✅" :
             app.id === "pos-lite" ? "🛒" :
             app.id === "booking-page" ? "📋" : "🔧"}
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-sm font-medium leading-tight truncate">{app.name}</h3>

          {/* Tags */}
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {[...app.type, ...app.templates].slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  typeColors[tag] || "bg-secondary text-muted-foreground"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
            <button
              className="flex items-center gap-1 active:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onHeart(app.id);
              }}
            >
              <Heart
                size={13}
                className={isLiked ? "fill-coral text-coral" : ""}
              />
              {hearts}
            </button>
            <span className="flex items-center gap-1">
              <Eye size={13} />
              {tryouts}
            </span>
          </div>
            </button>
            <span className="flex items-center gap-1">
              <Eye size={13} />
              {app.tryouts}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons below card */}
      <div className="flex gap-1.5">
        <button
          className="flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground text-xs font-medium py-2 rounded-lg active:scale-95 transition-transform"
          onClick={handleCopy}
        >
          <Copy size={12} />
          Copy Repo
        </button>
        <button
          className="flex-1 text-xs font-medium py-2 rounded-lg border border-border text-foreground active:scale-95 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/remixes/${app.id}`);
          }}
        >
          See Remixes →
        </button>
      </div>
    </div>
  );
};

export default ToolCard;

import { Heart, Eye, ArrowRight } from "lucide-react";
import { AppMeta } from "@/data/apps";
import { thumbnails } from "@/data/thumbnails";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ToolCardProps {
  app: AppMeta;
  isLiked: boolean;
  onTapScreenshot: (app: AppMeta, rect: DOMRect) => void;
  onTapName: (app: AppMeta) => void;
  onHeart: (appId: string) => void;
  hearts: number;
  tryouts: number;
}

const typeColors: Record<string, string> = {
  Hot: "bg-coral/20 text-coral",
  New: "bg-primary/20 text-primary",
  "Editor Choice": "bg-accent/20 text-accent",
};

const ToolCard = ({ app, isLiked, onTapScreenshot, onTapName, onHeart, hearts, tryouts }: ToolCardProps) => {
  const thumb = thumbnails[app.id];
  const navigate = useNavigate();

  const handleTryout = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `Pull this GitHub repo and deploy it for me: ${app.repo}`
    );
    toast.success("Prompt copied! Paste into your AI agent", { duration: 2000 });
    setTimeout(() => navigate("/ai-guide"), 300);
  };

  return (
    <div className="flex flex-col gap-0 group">
      {/* Screenshot zone */}
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer active:scale-[0.97] transition-transform duration-150"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onTapScreenshot(app, rect);
        }}
      >
        <div className="aspect-[4/3] bg-secondary overflow-hidden">
          {thumb ? (
            <img
              src={thumb}
              alt={app.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-primary/20 to-electric/20">🔧</div>
          )}
        </div>

        {/* Tags overlay */}
        <div className="absolute top-2 left-2 flex gap-1">
          {app.type.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`text-[9px] px-2 py-0.5 rounded-full font-semibold backdrop-blur-md ${
                typeColors[tag] || "bg-secondary/80 text-secondary-foreground"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2 text-[10px] text-foreground/80">
          <span className="flex items-center gap-0.5 glass rounded-full px-2 py-0.5">
            <Eye size={10} />
            {tryouts}
          </span>
        </div>
      </div>

      {/* Name zone */}
      <div
        className="px-1 pt-2 pb-1 cursor-pointer active:opacity-70 transition-opacity"
        onClick={() => onTapName(app)}
      >
        <h3 className="text-[13px] font-semibold font-display leading-tight truncate text-foreground">{app.name}</h3>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{app.description}</p>
      </div>

      {/* Heart + Try It row */}
      <div className="px-1 pb-1 flex items-center justify-between">
        <button
          className="flex items-center gap-1 text-[11px] text-muted-foreground active:scale-110 transition-transform"
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

        <button
          className="flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-electric text-primary-foreground active:scale-95 transition-transform"
          onClick={handleTryout}
        >
          Try It
          <ArrowRight size={10} />
        </button>
      </div>
    </div>
  );
};

export default ToolCard;

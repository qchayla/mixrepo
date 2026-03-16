import { Heart, Eye, Copy, ArrowRight } from "lucide-react";
import { AppMeta } from "@/data/apps";
import { thumbnails } from "@/data/thumbnails";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRef } from "react";

interface ToolCardProps {
  app: AppMeta;
  isLiked: boolean;
  onTap: (app: AppMeta, rect: DOMRect) => void;
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
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `Pull this GitHub repo and deploy it for me: ${app.repo}`
    );
    toast.success("Prompt copied! Paste into your AI agent", {
      duration: 2000,
    });
  };

  const handleTap = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      onTap(app, rect);
    }
  };

  const thumb = thumbnails[app.id];

  return (
    <div className="flex flex-col gap-1.5">
      <div
        ref={cardRef}
        className="bg-card rounded-lg border border-border overflow-hidden active:scale-[0.98] transition-transform duration-100 cursor-pointer"
        onClick={handleTap}
      >
        {/* Thumbnail */}
        <div className="aspect-[4/3] bg-secondary overflow-hidden">
          {thumb ? (
            <img
              src={thumb}
              alt={app.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>
          )}
        </div>

        {/* Content */}
        <div className="p-2.5">
          <h3 className="text-[13px] font-medium leading-tight truncate">{app.name}</h3>

          {/* Tags */}
          <div className="flex gap-1 mt-1 flex-wrap">
            {[...app.type, ...app.templates].slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                  typeColors[tag] || "bg-secondary text-muted-foreground"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
            <button
              className="flex items-center gap-1 active:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onHeart(app.id);
              }}
            >
              <Heart
                size={12}
                className={isLiked ? "fill-coral text-coral" : ""}
              />
              {hearts}
            </button>
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {tryouts}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <button
        className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-[11px] font-medium py-2 rounded-lg active:scale-95 transition-transform w-full"
        onClick={handleCopy}
      >
        <Copy size={11} />
        Copy Repo
      </button>
      <button
        className="flex items-center justify-center gap-1 text-[11px] font-medium py-1.5 rounded-md text-muted-foreground active:opacity-70 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/remixes/${app.id}`);
        }}
      >
        Remixes
        <ArrowRight size={11} />
      </button>
    </div>
  );
};

export default ToolCard;

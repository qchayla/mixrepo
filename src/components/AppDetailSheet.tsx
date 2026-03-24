import { X, Share2, Copy, ArrowRight, Heart } from "lucide-react";
import { AppMeta } from "@/data/apps";
import { useRemixes } from "@/hooks/useApps";
import { screenshots } from "@/data/thumbnails";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRef, useState, useCallback, useEffect } from "react";

interface AppDetailSheetProps {
  app: AppMeta | null;
  visible: boolean;
  onClose: () => void;
  scrollToScreenshots?: boolean;
  isLiked: boolean;
  onHeart: (appId: string) => void;
  hearts: number;
  tryouts: number;
}

const AppDetailSheet = ({
  app,
  visible,
  onClose,
  scrollToScreenshots = false,
  isLiked,
  onHeart,
  hearts,
  tryouts,
}: AppDetailSheetProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const screenshotRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef<{ y: number; time: number } | null>(null);
  const [animState, setAnimState] = useState<"hidden" | "entering" | "visible" | "leaving">("hidden");
  const [activeSlide, setActiveSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const { data: remixes = [] } = useRemixes(app?.id);

  useEffect(() => {
    if (visible && animState === "hidden") {
      setActiveSlide(0);
      setLoadedImages(new Set());
      setAnimState("entering");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimState("visible"));
      });
    }
  }, [visible]);

  useEffect(() => {
    if (animState === "visible" && scrollRef.current) {
      if (scrollToScreenshots) {
        scrollRef.current.scrollTop = 0;
      } else if (descriptionRef.current) {
        descriptionRef.current.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }
  }, [animState, scrollToScreenshots]);

  const handleClose = useCallback(() => {
    setDragY(0);
    setIsDragging(false);
    setAnimState("leaving");
    setTimeout(() => {
      setAnimState("hidden");
      onClose();
    }, 300);
  }, [onClose]);

  const handleOwnIt = () => {
    if (!app) return;
    navigator.clipboard.writeText(
      `Pull this GitHub repo and deploy it for me: ${app.repo}`
    );
    toast.success("Prompt copied! Paste into your AI agent", { duration: 2000 });
    setTimeout(() => navigate("/ai-guide"), 300);
  };

  const handleShare = async () => {
    if (!app) return;
    const shareData = {
      title: `${app.name} — ToolBox`,
      text: app.description || `Check out ${app.name} on ToolBox!`,
      url: `${window.location.origin}/?tool=${app.id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied!");
      }
    } catch {
      // cancelled
    }
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { y: e.touches[0].clientY, time: Date.now() };
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !isDragging) return;
    const dy = Math.max(0, e.touches[0].clientY - touchStartRef.current.y);
    setDragY(dy);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    const elapsed = Date.now() - touchStartRef.current.time;
    const velocity = dragY / Math.max(elapsed, 1);
    if (dragY > 100 || velocity > 0.4) {
      handleClose();
    } else {
      setDragY(0);
    }
    setIsDragging(false);
    touchStartRef.current = null;
  }, [dragY, handleClose]);

  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const slideWidth = el.offsetWidth;
    const index = Math.round(el.scrollLeft / slideWidth);
    setActiveSlide(index);
  }, []);

  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: index * carouselRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  if (animState === "hidden") return null;
  if (!app) return null;

  const appScreenshots = screenshots[app.id] || [];
  const isVisible = animState === "visible";
  const dragProgress = Math.min(dragY / 400, 1);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        style={{
          opacity: isVisible ? 1 - dragProgress * 0.5 : 0,
          transition: isDragging ? "none" : "opacity 300ms ease",
        }}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-card rounded-t-3xl overflow-hidden"
        style={{
          maxHeight: "92vh",
          transform: isVisible
            ? `translateY(${dragY}px)`
            : "translateY(100%)",
          transition: isDragging ? "none" : "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab"
          style={{ touchAction: "none" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Close + Share */}
        <div className="flex items-center justify-between px-4 pb-2 relative z-30">
          <button
            className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-90 transition-transform"
            onClick={handleClose}
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-90 transition-transform"
              onClick={handleShare}
            >
              <Share2 size={15} />
            </button>
            <button
              className="flex items-center gap-1 text-[11px] active:scale-95 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onHeart(app.id);
              }}
            >
              <Heart size={15} className={isLiked ? "fill-coral text-coral" : "text-muted-foreground"} />
              <span className="text-muted-foreground">{hearts}</span>
            </button>
          </div>
        </div>

        {/* Scrollable content — screenshots are sticky, text covers them */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-28">

          {/* Screenshots — sticky so they stay behind as text scrolls over */}
          <div ref={screenshotRef} className="sticky top-0 z-0 px-4">
            {appScreenshots.length > 0 && (
              <div className="relative">
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-2xl"
                  onScroll={handleCarouselScroll}
                  style={{ scrollBehavior: "smooth" }}
                >
                  {appScreenshots.map((src, i) => (
                    <div
                      key={i}
                      className="w-full shrink-0 snap-center relative"
                      style={{ aspectRatio: "3/4" }}
                    >
                      {/* Shimmer skeleton */}
                      {!loadedImages.has(i) && (
                        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-secondary">
                          <div
                            className="absolute inset-0 animate-shimmer"
                            style={{
                              backgroundImage: "linear-gradient(90deg, transparent 0%, hsl(var(--muted-foreground) / 0.08) 50%, transparent 100%)",
                              backgroundSize: "200% 100%",
                            }}
                          />
                        </div>
                      )}
                      <img
                        src={src}
                        alt={`${app.name} screenshot ${i + 1}`}
                        className="w-full h-full object-cover rounded-2xl"
                        onLoad={() => handleImageLoad(i)}
                        style={{
                          opacity: isVisible && loadedImages.has(i) ? 1 : 0,
                          transform: isVisible && loadedImages.has(i) ? "scale(1)" : "scale(0.97)",
                          transition: `opacity 500ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Dot indicators */}
                {appScreenshots.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {appScreenshots.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === activeSlide
                            ? "w-6 bg-primary"
                            : "w-1.5 bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description panel — covers screenshots as user scrolls */}
          <div
            ref={descriptionRef}
            className="relative z-10 bg-card rounded-t-3xl -mt-6 pt-6 min-h-[60vh]"
            style={{
              boxShadow: "0 -20px 40px -10px hsl(var(--background) / 0.8)",
            }}
          >
            <div className="px-5">
              <h2
                className="text-xl font-bold font-display"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 300ms ease 100ms, transform 300ms ease 100ms",
                }}
              >
                {app.name}
              </h2>
              <div
                className="flex gap-1.5 mt-2.5 flex-wrap"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: "opacity 300ms ease 150ms",
                }}
              >
                {[...app.type, ...app.templates].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p
                className="text-sm text-muted-foreground mt-4 leading-relaxed"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 300ms ease 200ms, transform 300ms ease 200ms",
                }}
              >
                {app.description}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-3">
                {tryouts.toLocaleString()} people tried this · {hearts} likes
              </p>
            </div>

            {/* Remixes */}
            {remixes.length > 0 && (
              <div className="px-5 mt-8">
                <h3 className="text-sm font-semibold font-display text-muted-foreground uppercase tracking-wider mb-3">
                  Community Remixes
                </h3>
                <div className="flex flex-col gap-2">
                  {remixes.map((remix) => (
                    <div
                      key={remix.id}
                      className="glass rounded-xl p-3 active:scale-[0.98] transition-transform cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Pull this GitHub repo and deploy it for me: ${remix.repo}`
                        );
                        toast.success("Remix prompt copied!");
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{remix.description}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            by {remix.author} · {remix.useCase}
                          </p>
                        </div>
                        <Copy size={12} className="text-muted-foreground shrink-0 ml-2 mt-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="h-8" />
          </div>
        </div>

        {/* Floating "Own It!" button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-card via-card/95 to-transparent z-20">
          <button
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-electric text-primary-foreground font-semibold text-sm active:scale-[0.97] transition-transform glow-primary flex items-center justify-center gap-2"
            onClick={handleOwnIt}
          >
            Own It!
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AppDetailSheet;

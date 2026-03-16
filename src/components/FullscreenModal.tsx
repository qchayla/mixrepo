import { X } from "lucide-react";
import { AppMeta } from "@/data/apps";
import { thumbnails } from "@/data/thumbnails";
import { useEffect, useRef, useState, useCallback } from "react";

export interface CardRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type AnimState = "hidden" | "expanding" | "expanded" | "collapsing";

interface FullscreenModalProps {
  app: AppMeta | null;
  visible: boolean;
  iframeSrc: string;
  onClose: () => void;
  onTemplateChange: (template: string) => void;
  activeTemplate: string;
  originRect: CardRect | null;
}

const SWIPE_THRESHOLD = 100;
const SWIPE_VELOCITY_THRESHOLD = 0.4;

const FullscreenModal = ({
  app,
  visible,
  iframeSrc,
  onClose,
  onTemplateChange,
  activeTemplate,
  originRect,
}: FullscreenModalProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [animState, setAnimState] = useState<AnimState>("hidden");
  const containerRef = useRef<HTMLDivElement>(null);

  // Swipe state
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef<{ y: number; time: number } | null>(null);

  // Handle open
  useEffect(() => {
    if (visible && animState === "hidden") {
      setAnimState("expanding");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimState("expanded");
        });
      });
    }
  }, [visible]);

  // Handle iframe loading
  useEffect(() => {
    if (!iframeSrc || iframeSrc === "about:blank") {
      setLoaded(false);
      setTimedOut(false);
      return;
    }
    setLoaded(false);
    setTimedOut(false);
    const timer = setTimeout(() => {
      if (!loaded) setTimedOut(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [iframeSrc]);

  const handleLoad = () => setLoaded(true);

  const handleClose = useCallback(() => {
    setDragY(0);
    setIsDragging(false);
    setAnimState("collapsing");
    setTimeout(() => {
      setAnimState("hidden");
      onClose();
    }, 300);
  }, [onClose]);

  // Swipe-down handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only track touches on the drag handle area (top 60px)
    const touch = e.touches[0];
    touchStartRef.current = { y: touch.clientY, time: Date.now() };
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !isDragging) return;
    const touch = e.touches[0];
    const dy = Math.max(0, touch.clientY - touchStartRef.current.y);
    setDragY(dy);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    const elapsed = Date.now() - touchStartRef.current.time;
    const velocity = dragY / Math.max(elapsed, 1);

    if (dragY > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD) {
      handleClose();
    } else {
      // Snap back
      setDragY(0);
    }
    setIsDragging(false);
    touchStartRef.current = null;
  }, [dragY, handleClose]);

  // Compute the transform for the "card origin" position
  const getOriginStyle = (): React.CSSProperties => {
    if (!originRect) {
      return { opacity: 0, transform: "scale(0.85)", borderRadius: "12px" };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaleX = originRect.width / vw;
    const scaleY = originRect.height / vh;
    const cardCenterX = originRect.left + originRect.width / 2;
    const cardCenterY = originRect.top + originRect.height / 2;
    const tx = cardCenterX - vw / 2;
    const ty = cardCenterY - vh / 2;

    return {
      transform: `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})`,
      borderRadius: "12px",
      opacity: 1,
    };
  };

  const getExpandedStyle = (): React.CSSProperties => ({
    transform: "translate(0, 0) scale(1, 1)",
    borderRadius: "0px",
    opacity: 1,
  });

  // Container style based on anim state + drag
  let containerStyle: React.CSSProperties;
  const dragProgress = Math.min(dragY / 400, 1);
  const dragScale = 1 - dragProgress * 0.08;
  const dragRadius = dragProgress * 20;
  const dragOpacity = 1 - dragProgress * 0.3;

  switch (animState) {
    case "hidden":
      containerStyle = { display: "none" };
      break;
    case "expanding":
      containerStyle = {
        ...getOriginStyle(),
        display: "flex",
        willChange: "transform, border-radius, opacity",
      };
      break;
    case "expanded":
      if (isDragging && dragY > 0) {
        containerStyle = {
          display: "flex",
          transform: `translateY(${dragY}px) scale(${dragScale})`,
          borderRadius: `${dragRadius}px`,
          opacity: dragOpacity,
          willChange: "transform, border-radius, opacity",
        };
      } else {
        containerStyle = {
          ...getExpandedStyle(),
          display: "flex",
          willChange: "auto",
        };
      }
      break;
    case "collapsing":
      containerStyle = {
        ...getOriginStyle(),
        display: "flex",
        willChange: "transform, border-radius, opacity",
      };
      break;
  }

  // Bounce easing for expand, smooth spring for collapse
  const expandCurve = "cubic-bezier(0.34, 1.56, 0.64, 1)";
  const collapseCurve = "cubic-bezier(0.32, 0.72, 0, 1)";

  const getTransition = () => {
    if (animState === "expanding") {
      return `transform 320ms ${expandCurve}, border-radius 320ms ${expandCurve}, opacity 200ms ease`;
    }
    if (animState === "collapsing") {
      return `transform 300ms ${collapseCurve}, border-radius 300ms ${collapseCurve}, opacity 200ms ease`;
    }
    // Snap-back when drag released without closing
    if (!isDragging && dragY === 0 && animState === "expanded") {
      return `transform 250ms ${expandCurve}, border-radius 250ms ease, opacity 200ms ease`;
    }
    return "none";
  };

  const thumb = app ? thumbnails[app.id] : undefined;
  const showContent = animState === "expanded" || animState === "collapsing";
  const backdropOpacity = animState === "expanded" ? (isDragging ? 1 - dragProgress * 0.6 : 1) : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-foreground/30"
        style={{
          opacity: backdropOpacity,
          pointerEvents: animState === "hidden" ? "none" : "auto",
          transition: isDragging ? "none" : "opacity 300ms ease",
        }}
        onClick={handleClose}
      />

      {/* Modal container */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden"
        style={{
          ...containerStyle,
          transition: getTransition(),
          transformOrigin: "center center",
        }}
      >
        {/* Swipe handle / drag zone — sits between close button */}
        <div
          className="absolute top-0 left-16 right-0 z-[55] flex justify-center"
          style={{ height: "48px", touchAction: "none" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drag indicator pill */}
          <div
            className="mt-2 w-9 h-1 rounded-full bg-muted-foreground/30"
            style={{
              opacity: showContent ? 1 : 0,
              transition: "opacity 200ms ease 150ms",
            }}
          />
        </div>

        {/* Close button */}
        <button
          className="absolute top-3 left-3 z-50 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg active:scale-90 transition-all duration-150"
          style={{
            opacity: showContent ? 1 : 0,
            transition: "opacity 150ms ease 100ms, transform 150ms ease",
          }}
          onClick={handleClose}
        >
          <X size={20} />
        </button>

        {/* App name header */}
        {app && (
          <div
            className="pt-5 pb-2 text-center shrink-0"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 200ms ease 80ms, transform 200ms ease 80ms",
            }}
          >
            <p className="text-sm font-medium">{app.name}</p>
          </div>
        )}

        {/* Iframe area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Thumbnail during expand */}
          {thumb && !showContent && (
            <img
              src={thumb}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {timedOut && !loaded && showContent ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center text-3xl">
                🔧
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Tool is taking a moment...
              </p>
              <button
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium active:scale-95 transition-transform"
                onClick={() => app && window.open(app.url, "_blank", "noopener")}
              >
                Open in browser →
              </button>
            </div>
          ) : null}

          {/* Pointer overlay to prevent iframe from stealing touches during drag */}
          {isDragging && (
            <div className="absolute inset-0 z-10" />
          )}

          <iframe
            ref={iframeRef}
            src={iframeSrc || "about:blank"}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            style={{
              opacity: loaded && !timedOut && showContent ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />

          {!loaded && !timedOut && iframeSrc && iframeSrc !== "about:blank" && showContent && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Template switcher */}
        {app && app.templates.length > 0 && (
          <div
            className="border-t border-border bg-card px-3 py-2.5 shrink-0"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 200ms ease 120ms, transform 200ms ease 120ms",
            }}
          >
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {app.templates.map((template) => (
                <button
                  key={template}
                  className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                    activeTemplate === template
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => onTemplateChange(template)}
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FullscreenModal;

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

  // Handle open
  useEffect(() => {
    if (visible && animState === "hidden") {
      // Force a layout read then start expanding
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
    setAnimState("collapsing");
    setTimeout(() => {
      setAnimState("hidden");
      onClose();
    }, 280);
  }, [onClose]);

  // Compute the transform for the "card origin" position
  const getOriginStyle = (): React.CSSProperties => {
    if (!originRect) {
      return {
        opacity: 0,
        transform: "scale(0.85)",
        borderRadius: "12px",
      };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaleX = originRect.width / vw;
    const scaleY = originRect.height / vh;
    // Translate from center of screen to center of card
    const cardCenterX = originRect.left + originRect.width / 2;
    const cardCenterY = originRect.top + originRect.height / 2;
    const screenCenterX = vw / 2;
    const screenCenterY = vh / 2;
    const tx = cardCenterX - screenCenterX;
    const ty = cardCenterY - screenCenterY;

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

  // Determine container style based on anim state
  let containerStyle: React.CSSProperties;
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
      containerStyle = {
        ...getExpandedStyle(),
        display: "flex",
        willChange: "auto",
      };
      break;
    case "collapsing":
      containerStyle = {
        ...getOriginStyle(),
        display: "flex",
        willChange: "transform, border-radius, opacity",
      };
      break;
  }

  const thumb = app ? thumbnails[app.id] : undefined;
  const showContent = animState === "expanded" || animState === "collapsing";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-foreground/30 transition-opacity duration-300"
        style={{
          opacity: animState === "expanded" ? 1 : 0,
          pointerEvents: animState === "hidden" ? "none" : "auto",
        }}
        onClick={handleClose}
      />

      {/* Modal container */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden"
        style={{
          ...containerStyle,
          transition:
            animState === "expanding" || animState === "collapsing"
              ? "transform 280ms cubic-bezier(0.32, 0.72, 0, 1), border-radius 280ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease"
              : "none",
          transformOrigin: "center center",
        }}
      >
        {/* Close button — always visible */}
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
            className="pt-4 pb-2 text-center shrink-0"
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
          {/* Show thumbnail as preview during expand animation */}
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
                onClick={() =>
                  app && window.open(app.url, "_blank", "noopener")
                }
              >
                Open in browser →
              </button>
            </div>
          ) : null}

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

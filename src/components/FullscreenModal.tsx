import { X } from "lucide-react";
import { AppMeta } from "@/data/apps";
import { useEffect, useRef, useState } from "react";

interface FullscreenModalProps {
  app: AppMeta | null;
  visible: boolean;
  iframeSrc: string;
  onClose: () => void;
  onTemplateChange: (template: string) => void;
  activeTemplate: string;
}

const FullscreenModal = ({
  app,
  visible,
  iframeSrc,
  onClose,
  onTemplateChange,
  activeTemplate,
}: FullscreenModalProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

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

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col transition-transform duration-200"
      style={{ display: visible ? "flex" : "none" }}
    >
      {/* Close button */}
      <button
        className="absolute top-3 left-3 z-50 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-sm active:scale-90 transition-transform"
        onClick={onClose}
      >
        <X size={20} />
      </button>

      {/* App name */}
      {app && (
        <div className="pt-4 pb-2 text-center">
          <p className="text-sm font-medium">{app.name}</p>
        </div>
      )}

      {/* Iframe area */}
      <div className="flex-1 relative">
        {timedOut && !loaded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center text-3xl">
              {app ? "🔧" : ""}
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
            opacity: loaded && !timedOut ? 1 : 0,
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />

        {!loaded && !timedOut && iframeSrc && iframeSrc !== "about:blank" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Template switcher */}
      {app && app.templates.length > 0 && (
        <div className="border-t border-border bg-card px-3 py-2.5">
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
  );
};

export default FullscreenModal;

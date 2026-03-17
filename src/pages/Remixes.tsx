import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Eye } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { useApps, useRemixes } from "@/hooks/useApps";

const Remixes = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { apps } = useApps();
  const { data: remixList = [], isLoading } = useRemixes(appId);
  const app = apps.find((a) => a.id === appId);

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">App not found</p>
      </div>
    );
  }

  const handleCopyRepo = (repo: string) => {
    navigator.clipboard.writeText(
      `Pull this GitHub repo and deploy it for me: ${repo}`
    );
    toast.success("Prompt copied! Paste into your AI agent");
    setTimeout(() => navigate("/ai-guide"), 300);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/50 px-4 py-3" style={{ background: "hsl(var(--glass-bg))" }}>
        <button
          className="flex items-center gap-2 text-sm font-semibold font-display text-foreground active:opacity-70"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="px-4 py-4">
        <h1 className="text-lg font-bold font-display">{app.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{app.description}</p>

        <h2 className="text-sm font-semibold font-display mt-6 mb-3">
          Community Remixes ({remixList.length})
        </h2>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {remixList.map((remix) => (
              <div key={remix.id} className="glass rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold">{remix.author}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{remix.description}</p>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/15 text-primary font-semibold shrink-0 ml-2">
                    {remix.useCase}
                  </span>
                </div>

                <ul className="mt-2 space-y-1">
                  {remix.features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Eye size={12} />
                    {remix.tryouts} tryouts
                  </span>
                  <button
                    className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-electric text-primary-foreground font-semibold active:scale-95 transition-transform"
                    onClick={() => handleCopyRepo(remix.repo)}
                  >
                    <Copy size={11} />
                    Own It!
                  </button>
                </div>
              </div>
            ))}

            {remixList.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No remixes yet — be the first!
              </p>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Remixes;

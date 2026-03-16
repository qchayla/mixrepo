import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Eye } from "lucide-react";
import { apps, getRemixesForApp } from "@/data/apps";
import { toast } from "sonner";

const Remixes = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const app = apps.find((a) => a.id === appId);
  const remixList = appId ? getRemixesForApp(appId) : [];

  if (!app) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">App not found</p>
      </div>
    );
  }

  const handleCopyRepo = (repo: string) => {
    navigator.clipboard.writeText(
      `Pull this GitHub repo and deploy it for me: ${repo}`
    );
    toast.success("Prompt copied! Paste into your AI agent");
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
          Back
        </button>
      </div>

      <div className="px-4 py-4">
        <h1 className="text-lg font-semibold">{app.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{app.description}</p>

        <h2 className="text-sm font-medium mt-6 mb-3">
          Community Remixes ({remixList.length})
        </h2>

        <div className="flex flex-col gap-3">
          {remixList.map((remix) => (
            <div
              key={remix.id}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">{remix.author}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {remix.description}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium shrink-0 ml-2">
                  {remix.useCase}
                </span>
              </div>

              <ul className="mt-2 space-y-1">
                {remix.features.map((f) => (
                  <li
                    key={f}
                    className="text-xs text-muted-foreground flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Eye size={12} />
                  {remix.tryouts} tryouts
                </span>
                <div className="flex gap-2">
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-medium active:scale-95 transition-transform"
                    onClick={() => {
                      // Navigate back to gallery and open this remix in iframe
                      navigate("/", { state: { openUrl: remix.url, appName: remix.author + "'s remix" } });
                    }}
                  >
                    Try
                  </button>
                  <button
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium active:scale-95 transition-transform"
                    onClick={() => handleCopyRepo(remix.repo)}
                  >
                    <Copy size={11} />
                    Copy Repo
                  </button>
                </div>
              </div>
            </div>
          ))}

          {remixList.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No remixes yet — be the first!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Remixes;

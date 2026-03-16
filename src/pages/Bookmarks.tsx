import { useState, useCallback, useEffect } from "react";
import { Heart, ArrowRight, Copy, Sparkles } from "lucide-react";
import { apps, AppMeta } from "@/data/apps";
import { thumbnails } from "@/data/thumbnails";
import { useLikedApps } from "@/hooks/useLikedApps";
import BottomNav from "@/components/BottomNav";
import AppDetailSheet from "@/components/AppDetailSheet";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchAllStats } from "@/lib/stats";

const Bookmarks = () => {
  const { likedApps, toggleLike, isLiked } = useLikedApps();
  const navigate = useNavigate();
  const [detailApp, setDetailApp] = useState<AppMeta | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [scrollToScreenshots, setScrollToScreenshots] = useState(false);
  const [statsMap, setStatsMap] = useState<Record<string, { hearts: number; tryouts: number }>>({});

  useEffect(() => {
    fetchAllStats().then(setStatsMap);
  }, []);

  const bookmarkedApps = apps.filter((a) => likedApps.has(a.id));

  const handleCopyAll = () => {
    if (bookmarkedApps.length === 0) return;
    const repoList = bookmarkedApps
      .map((a) => `- ${a.name}: ${a.repo}`)
      .join("\n");
    const prompt = `Create a beautiful landing page that acts as a dashboard/hub for the following micro-tools. Each tool should have its own card with an icon, name, short description, and a button to launch it. The landing page should have a modern dark theme with a sidebar or grid layout for easy navigation between tools.\n\nTools to include:\n${repoList}\n\nPull each GitHub repo and set up shortcuts/links to each tool. Make the landing page responsive and mobile-friendly.`;
    navigator.clipboard.writeText(prompt);
    toast.success("All-in-one prompt copied! Paste into your AI agent", { duration: 3000 });
    setTimeout(() => navigate("/ai-guide"), 500);
  };

  const handleHeart = (appId: string) => {
    toggleLike(appId);
    // Update local stats optimistically
    const wasLiked = isLiked(appId);
    setStatsMap((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        hearts: wasLiked
          ? Math.max((prev[appId]?.hearts || 1) - 1, 0)
          : (prev[appId]?.hearts || 0) + 1,
      },
    }));
  };

  const handleTapScreenshot = useCallback((app: AppMeta, _rect: DOMRect) => {
    setDetailApp(app);
    setScrollToScreenshots(true);
    setDetailVisible(true);
  }, []);

  const handleTapName = useCallback((app: AppMeta) => {
    setDetailApp(app);
    setScrollToScreenshots(false);
    setDetailVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-coral" />
              <h1 className="text-lg font-bold font-display">My Tools</h1>
              {bookmarkedApps.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
                  {bookmarkedApps.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {bookmarkedApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 pt-32 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Heart size={28} className="text-muted-foreground" />
          </div>
          <h2 className="text-base font-bold font-display mb-1">No bookmarks yet</h2>
          <p className="text-sm text-muted-foreground">
            Tap the heart on any tool to save it here for quick access.
          </p>
          <button
            className="mt-6 px-5 py-2.5 rounded-xl glass text-sm font-semibold active:scale-95 transition-transform"
            onClick={() => navigate("/")}
          >
            Browse Gallery
          </button>
        </div>
      ) : (
        <>
          {/* Copy All banner */}
          <div className="px-4 pt-4">
            <button
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-electric text-primary-foreground font-semibold text-sm active:scale-[0.97] transition-transform glow-primary flex items-center justify-center gap-2"
              onClick={handleCopyAll}
            >
              <Copy size={15} />
              Copy All — Build My Dashboard
              <Sparkles size={14} />
            </button>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Generates a prompt to create a landing page with all your tools
            </p>
          </div>

          {/* Bookmarked cards */}
          <div className="px-4 pt-4 flex flex-col gap-3">
            {bookmarkedApps.map((app) => {
              const thumb = thumbnails[app.id];
              return (
                <div
                  key={app.id}
                  className="glass rounded-xl overflow-hidden flex gap-3 p-3 active:scale-[0.98] transition-transform"
                >
                  {/* Thumbnail */}
                  <div
                    className="w-20 h-20 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => handleTapScreenshot(app, new DOMRect())}
                  >
                    {thumb ? (
                      <img src={thumb} alt={app.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center text-lg">🔧</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between cursor-pointer" onClick={() => handleTapName(app)}>
                    <div>
                      <h3 className="text-sm font-semibold font-display truncate">{app.name}</h3>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        className="flex items-center gap-1 text-[11px] active:scale-110 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHeart(app.id);
                        }}
                      >
                        <Heart size={13} className="fill-coral text-coral" />
                        <span className="text-muted-foreground">{statsMap[app.id]?.hearts ?? app.hearts}</span>
                      </button>
                      <button
                        className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-gradient-to-r from-primary to-electric text-primary-foreground active:scale-95 transition-transform ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            `Pull this GitHub repo and deploy it for me: ${app.repo}`
                          );
                          toast.success("Prompt copied!");
                          setTimeout(() => navigate("/ai-guide"), 300);
                        }}
                      >
                        Try It
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <AppDetailSheet
        app={detailApp}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        scrollToScreenshots={scrollToScreenshots}
        isLiked={detailApp ? isLiked(detailApp.id) : false}
        onHeart={handleHeart}
        hearts={detailApp ? statsMap[detailApp.id]?.hearts ?? detailApp.hearts : 0}
        tryouts={detailApp ? statsMap[detailApp.id]?.tryouts ?? detailApp.tryouts : 0}
      />

      <BottomNav />
    </div>
  );
};

export default Bookmarks;

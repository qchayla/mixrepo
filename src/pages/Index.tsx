import { useState, useCallback } from "react";
import { Search, Sparkles, Sun, Moon } from "lucide-react";
import { AppMeta } from "@/data/apps";
import ToolCard from "@/components/ToolCard";
import AppDetailSheet from "@/components/AppDetailSheet";
import { useTheme } from "@/hooks/useTheme";
import BottomNav from "@/components/BottomNav";
import { incrementHearts, decrementHearts } from "@/lib/stats";
import { useLikedApps } from "@/hooks/useLikedApps";
import { useApps } from "@/hooks/useApps";

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [detailApp, setDetailApp] = useState<AppMeta | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [scrollToScreenshots, setScrollToScreenshots] = useState(false);
  const { isLiked, toggleLike } = useLikedApps();
  const { theme, toggleTheme } = useTheme();
  const { apps, isLoading, statsMap, getAllTemplates, getAllTypes } = useApps();
  const [localStatsOverrides, setLocalStatsOverrides] = useState<Record<string, { hearts: number }>>({});

  // Open detail sheet from URL param on first load
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const toolId = params.get("tool");
    if (toolId) {
      const app = apps.find((a) => a.id === toolId);
      if (app) {
        setDetailApp(app);
        setScrollToScreenshots(false);
        setDetailVisible(true);
      }
    }
  });

  const allTemplates = getAllTemplates();
  const allTypes = getAllTypes();
  const filterChips = [...allTypes, ...allTemplates];

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      !search ||
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      !activeFilter ||
      app.type.includes(activeFilter) ||
      app.templates.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

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

  const handleCloseDetail = () => setDetailVisible(false);

  const getHearts = (appId: string) =>
    localStatsOverrides[appId]?.hearts ?? statsMap[appId]?.hearts ?? apps.find(a => a.id === appId)?.hearts ?? 0;

  const getTryouts = (appId: string) =>
    statsMap[appId]?.tryouts ?? apps.find(a => a.id === appId)?.tryouts ?? 0;

  const handleHeart = (appId: string) => {
    const wasLiked = isLiked(appId);
    toggleLike(appId);
    const currentHearts = getHearts(appId);
    setLocalStatsOverrides((prev) => ({
      ...prev,
      [appId]: {
        hearts: wasLiked ? Math.max(currentHearts - 1, 0) : currentHearts + 1,
      },
    }));
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/50" style={{ background: "hsl(var(--glass-bg))" }}>
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h1 className="text-lg font-bold font-display gradient-text">ToolBox</h1>
            </div>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-90 transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-primary" />
              )}
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60 font-medium"
            />
          </div>
        </div>
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold shrink-0 transition-all duration-200 ${
              !activeFilter ? "bg-primary text-primary-foreground glow-primary" : "glass text-secondary-foreground"
            }`}
            onClick={() => setActiveFilter(null)}
          >
            All
          </button>
          {filterChips.map((chip) => (
            <button
              key={chip}
              className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold shrink-0 transition-all duration-200 ${
                activeFilter === chip ? "bg-primary text-primary-foreground glow-primary" : "glass text-secondary-foreground"
              }`}
              onClick={() => setActiveFilter(activeFilter === chip ? null : chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="px-3 py-4 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="px-3 py-4 grid grid-cols-2 gap-3">
          {filteredApps.map((app) => (
            <ToolCard
              key={app.id}
              app={app}
              isLiked={isLiked(app.id)}
              onTapScreenshot={handleTapScreenshot}
              onTapName={handleTapName}
              onHeart={handleHeart}
              hearts={getHearts(app.id)}
              tryouts={getTryouts(app.id)}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredApps.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground text-sm">No tools found</p>
        </div>
      )}

      <AppDetailSheet
        app={detailApp}
        visible={detailVisible}
        onClose={handleCloseDetail}
        scrollToScreenshots={scrollToScreenshots}
        isLiked={detailApp ? isLiked(detailApp.id) : false}
        onHeart={handleHeart}
        hearts={detailApp ? getHearts(detailApp.id) : 0}
        tryouts={detailApp ? getTryouts(detailApp.id) : 0}
      />

      <BottomNav />
    </div>
  );
};

export default Index;

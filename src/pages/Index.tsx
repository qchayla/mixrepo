import { useState, useCallback, useEffect } from "react";
import { Search, Sparkles, Sun, Moon } from "lucide-react";
import { apps, getAllTemplates, getAllTypes, AppMeta } from "@/data/apps";
import ToolCard from "@/components/ToolCard";
import AppDetailSheet from "@/components/AppDetailSheet";
import { useTheme } from "@/hooks/useTheme";
import BottomNav from "@/components/BottomNav";
import { fetchAllStats, incrementHearts, decrementHearts } from "@/lib/stats";
import { useLikedApps } from "@/hooks/useLikedApps";

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [detailApp, setDetailApp] = useState<AppMeta | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [scrollToScreenshots, setScrollToScreenshots] = useState(false);
  const { isLiked, toggleLike } = useLikedApps();
  const { theme, toggleTheme } = useTheme();
  const [statsMap, setStatsMap] = useState<Record<string, { hearts: number; tryouts: number }>>({});

  useEffect(() => {
    fetchAllStats().then(setStatsMap);
  }, []);

  useEffect(() => {
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
  }, []);

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

  const handleHeart = (appId: string) => {
    const wasLiked = isLiked(appId);
    toggleLike(appId);
    if (wasLiked) {
      setStatsMap((prev) => ({
        ...prev,
        [appId]: { ...prev[appId], hearts: Math.max((prev[appId]?.hearts || 1) - 1, 0) },
      }));
    } else {
      setStatsMap((prev) => ({
        ...prev,
        [appId]: { ...prev[appId], hearts: (prev[appId]?.hearts || 0) + 1 },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50">
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

      <div className="px-3 py-4 grid grid-cols-2 gap-3">
        {filteredApps.map((app) => (
          <ToolCard
            key={app.id}
            app={app}
            isLiked={isLiked(app.id)}
            onTapScreenshot={handleTapScreenshot}
            onTapName={handleTapName}
            onHeart={handleHeart}
            hearts={statsMap[app.id]?.hearts ?? app.hearts}
            tryouts={statsMap[app.id]?.tryouts ?? app.tryouts}
          />
        ))}
      </div>

      {filteredApps.length === 0 && (
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
        hearts={detailApp ? statsMap[detailApp.id]?.hearts ?? detailApp.hearts : 0}
        tryouts={detailApp ? statsMap[detailApp.id]?.tryouts ?? detailApp.tryouts : 0}
      />

      <BottomNav />
    </div>
  );
};

export default Index;

import { useState, useCallback, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { apps, getAllTemplates, getAllTypes, AppMeta } from "@/data/apps";
import ToolCard from "@/components/ToolCard";
import FullscreenModal from "@/components/FullscreenModal";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { fetchAllStats, incrementTryouts, incrementHearts, decrementHearts } from "@/lib/stats";
import { CardRect } from "@/components/FullscreenModal";

const IDLE_TIMEOUT = 5 * 60 * 1000;

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentApp, setCurrentApp] = useState<AppMeta | null>(null);
  const [iframeSrc, setIframeSrc] = useState("");
  const [activeTemplate, setActiveTemplate] = useState("");
  const [likedApps, setLikedApps] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("liked_apps");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [statsMap, setStatsMap] = useState<Record<string, { hearts: number; tryouts: number }>>({});
  const lastViewedAppId = useRef<string | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();

  // Fetch stats from Supabase
  useEffect(() => {
    fetchAllStats().then(setStatsMap);
  }, []);

  const allTemplates = getAllTemplates();
  const allTypes = getAllTypes();
  const filterChips = [...allTypes, ...allTemplates];

  // Idle cleanup
  useEffect(() => {
    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setIframeSrc("");
        lastViewedAppId.current = null;
      }, IDLE_TIMEOUT);
    };
    window.addEventListener("touchstart", resetIdle);
    window.addEventListener("click", resetIdle);
    resetIdle();
    return () => {
      window.removeEventListener("touchstart", resetIdle);
      window.removeEventListener("click", resetIdle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

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

  const handleTapCard = useCallback(
    (app: AppMeta) => {
      // Increment tryouts
      incrementTryouts(app.id);
      setStatsMap(prev => ({
        ...prev,
        [app.id]: { ...prev[app.id], tryouts: (prev[app.id]?.tryouts || app.tryouts) + 1 }
      }));

      if (lastViewedAppId.current && lastViewedAppId.current !== app.id) {
        setIframeSrc("about:blank");
        setTimeout(() => {
          setIframeSrc(app.url);
          setCurrentApp(app);
          setActiveTemplate("");
          setModalVisible(true);
          lastViewedAppId.current = app.id;
        }, 50);
      } else if (lastViewedAppId.current === app.id) {
        setModalVisible(true);
      } else {
        setIframeSrc(app.url);
        setCurrentApp(app);
        setActiveTemplate("");
        setModalVisible(true);
        lastViewedAppId.current = app.id;
      }
    },
    []
  );

  const handleCloseModal = () => setModalVisible(false);

  const handleTemplateChange = (template: string) => {
    if (!currentApp) return;
    setActiveTemplate(template);
    const url = new URL(currentApp.url);
    url.searchParams.set("template", template);
    setIframeSrc(url.toString());
  };

  const handleHeart = (appId: string) => {
    const wasLiked = likedApps.has(appId);
    setLikedApps((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) next.delete(appId);
      else next.add(appId);
      localStorage.setItem("liked_apps", JSON.stringify(Array.from(next)));
      return next;
    });
    if (wasLiked) {
      decrementHearts(appId);
      setStatsMap(prev => ({
        ...prev,
        [appId]: { ...prev[appId], hearts: Math.max((prev[appId]?.hearts || 1) - 1, 0) }
      }));
    } else {
      incrementHearts(appId);
      setStatsMap(prev => ({
        ...prev,
        [appId]: { ...prev[appId], hearts: (prev[appId]?.hearts || 0) + 1 }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 pt-3 pb-2">
          <h1 className="text-lg font-semibold mb-3">⚡ ToolBox</h1>

          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium shrink-0 transition-colors ${
              !activeFilter
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => setActiveFilter(null)}
          >
            All
          </button>
          {filterChips.map((chip) => (
            <button
              key={chip}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium shrink-0 transition-colors ${
                activeFilter === chip
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() =>
                setActiveFilter(activeFilter === chip ? null : chip)
              }
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="px-4 py-4 grid grid-cols-2 gap-2">
        {filteredApps.map((app) => (
          <ToolCard
            key={app.id}
            app={app}
            isLiked={likedApps.has(app.id)}
            onTap={handleTapCard}
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

      {/* Fullscreen modal (single iframe) */}
      <FullscreenModal
        app={currentApp}
        visible={modalVisible}
        iframeSrc={iframeSrc}
        onClose={handleCloseModal}
        onTemplateChange={handleTemplateChange}
        activeTemplate={activeTemplate}
      />

      <BottomNav />
    </div>
  );
};

export default Index;

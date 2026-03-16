import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { incrementHearts, decrementHearts } from "@/lib/stats";

interface LikedAppsContextType {
  likedApps: Set<string>;
  toggleLike: (appId: string) => boolean; // returns new liked state
  isLiked: (appId: string) => boolean;
  count: number;
}

const LikedAppsContext = createContext<LikedAppsContextType | null>(null);

export const LikedAppsProvider = ({ children }: { children: ReactNode }) => {
  const [likedApps, setLikedApps] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("liked_apps");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleLike = useCallback((appId: string) => {
    let nowLiked = false;
    setLikedApps((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) {
        next.delete(appId);
        nowLiked = false;
      } else {
        next.add(appId);
        nowLiked = true;
      }
      localStorage.setItem("liked_apps", JSON.stringify(Array.from(next)));
      return next;
    });
    // We need to return after setState, but since setState is sync for Sets we can check
    // Actually toggleLike is called synchronously, so let's handle DB calls here
    if (likedApps.has(appId)) {
      decr(appId);
      return false;
    } else {
      incr(appId);
      return true;
    }
  }, [likedApps]);

  const isLiked = useCallback((appId: string) => likedApps.has(appId), [likedApps]);

  return (
    <LikedAppsContext.Provider value={{ likedApps, toggleLike, isLiked, count: likedApps.size }}>
      {children}
    </LikedAppsContext.Provider>
  );
};

function incr(appId: string) { incrementHearts(appId); }
function decr(appId: string) { decrementHearts(appId); }

export const useLikedApps = () => {
  const ctx = useContext(LikedAppsContext);
  if (!ctx) throw new Error("useLikedApps must be used within LikedAppsProvider");
  return ctx;
};

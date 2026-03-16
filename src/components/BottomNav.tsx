import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, BookOpen, PlusCircle, Heart } from "lucide-react";
import { useLikedApps } from "@/hooks/useLikedApps";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { count } = useLikedApps();

  const tabs = [
    { id: "/", label: "Gallery", icon: LayoutGrid, badge: 0 },
    { id: "/bookmarks", label: "My Tools", icon: Heart, badge: count },
    { id: "/ai-guide", label: "AI Guide", icon: BookOpen, badge: 0 },
    { id: "/submit", label: "Submit", icon: PlusCircle, badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t-0 rounded-t-2xl">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => {
          const isActive = path === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-coral text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNav;

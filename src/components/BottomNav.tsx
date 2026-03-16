import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, BookOpen, PlusCircle } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { id: "/", label: "Gallery", icon: LayoutGrid },
    { id: "/ai-guide", label: "AI Guide", icon: BookOpen },
    { id: "/submit", label: "Submit", icon: PlusCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => {
          const isActive = path === tab.id || (tab.id === "/" && path === "/");
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNav;

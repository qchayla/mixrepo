import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LikedAppsProvider } from "@/hooks/useLikedApps";
import { ThemeProvider } from "@/hooks/useTheme";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index.tsx";
import Remixes from "./pages/Remixes.tsx";
import AiGuide from "./pages/AiGuide.tsx";
import SubmitTool from "./pages/SubmitTool.tsx";
import Bookmarks from "./pages/Bookmarks.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LikedAppsProvider>
          <Sonner />
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/remixes/:appId" element={<Remixes />} />
                <Route path="/ai-guide" element={<AiGuide />} />
                <Route path="/submit" element={<SubmitTool />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </LikedAppsProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

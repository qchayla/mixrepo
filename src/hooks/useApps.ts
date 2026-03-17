import { useQuery } from "@tanstack/react-query";
import { fetchApps, fetchRemixes } from "@/lib/apps";
import { fetchAllStats } from "@/lib/stats";
import { AppMeta } from "@/data/apps";

export function useApps() {
  const appsQuery = useQuery({
    queryKey: ["apps"],
    queryFn: fetchApps,
    staleTime: 5 * 60 * 1000,
  });

  const statsQuery = useQuery({
    queryKey: ["app-stats"],
    queryFn: fetchAllStats,
    staleTime: 60 * 1000,
  });

  const apps: AppMeta[] = (appsQuery.data ?? []).map((app) => ({
    ...app,
    hearts: statsQuery.data?.[app.id]?.hearts ?? app.hearts,
    tryouts: statsQuery.data?.[app.id]?.tryouts ?? app.tryouts,
  }));

  // Derive filter helpers from fetched data
  const getAllTemplates = (): string[] => {
    const templates = new Set<string>();
    apps.forEach((app) => app.templates.forEach((t) => templates.add(t)));
    return Array.from(templates);
  };

  const getAllTypes = (): string[] => {
    const types = new Set<string>();
    apps.forEach((app) => app.type.forEach((t) => types.add(t)));
    return Array.from(types);
  };

  return {
    apps,
    isLoading: appsQuery.isLoading,
    error: appsQuery.error,
    statsMap: statsQuery.data ?? {},
    getAllTemplates,
    getAllTypes,
  };
}

export function useRemixes(appId: string | undefined) {
  return useQuery({
    queryKey: ["remixes", appId],
    queryFn: () => fetchRemixes(appId),
    enabled: !!appId,
    staleTime: 5 * 60 * 1000,
  });
}

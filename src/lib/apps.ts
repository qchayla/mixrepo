import { supabase } from "@/integrations/supabase/client";
import { AppMeta, RemixMeta, apps as fallbackApps, remixes as fallbackRemixes } from "@/data/apps";

export async function fetchApps(): Promise<AppMeta[]> {
  try {
    const { data, error } = await supabase
      .from("apps")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data) return fallbackApps;

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      url: row.url,
      repo: row.repo,
      screenshot: row.screenshot,
      templates: row.templates,
      type: row.type,
      hearts: 0,
      tryouts: 0,
      description: row.description ?? undefined,
    }));
  } catch {
    return fallbackApps;
  }
}

export async function fetchRemixes(appId?: string): Promise<RemixMeta[]> {
  try {
    let query = supabase.from("remixes").select("*");
    if (appId) query = query.eq("app_id", appId);
    const { data, error } = await query;

    if (error || !data) {
      return appId
        ? fallbackRemixes.filter((r) => r.appId === appId)
        : fallbackRemixes;
    }

    return data.map((row) => ({
      id: row.id,
      appId: row.app_id,
      author: row.author,
      description: row.description,
      features: row.features,
      useCase: row.use_case,
      url: row.url,
      repo: row.repo,
      tryouts: row.tryouts,
    }));
  } catch {
    return appId
      ? fallbackRemixes.filter((r) => r.appId === appId)
      : fallbackRemixes;
  }
}

export async function submitApp(data: {
  name: string;
  repo: string;
  description?: string;
  category?: string;
}): Promise<void> {
  const id = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const appRow = {
    id,
    name: data.name,
    url: "",
    repo: data.repo,
    screenshot: "",
    templates: data.category ? [data.category] : [],
    type: ["New"],
    description: data.description || null,
  };

  const { error: appError } = await supabase.from("apps").insert(appRow);

  if (appError) {
    // Handle duplicate ID — append random suffix and retry
    if (appError.code === "23505") {
      const retryId = `${id}-${Math.random().toString(36).slice(2, 6)}`;
      const { error: retryError } = await supabase
        .from("apps")
        .insert({ ...appRow, id: retryId });
      if (retryError) throw retryError;

      await supabase
        .from("app_stats")
        .insert({ app_id: retryId, hearts: 0, tryouts: 0 });
      return;
    }
    throw appError;
  }

  // Create matching app_stats row
  await supabase
    .from("app_stats")
    .insert({ app_id: id, hearts: 0, tryouts: 0 });
}

import { supabase } from "@/integrations/supabase/client";

export const incrementTryouts = async (appId: string) => {
  try {
    await supabase.rpc("increment_tryouts" as any, { _app_id: appId }).throwOnError();
  } catch {
    // Silent fail per spec
  }
};

export const incrementHearts = async (appId: string) => {
  try {
    await supabase.rpc("increment_hearts" as any, { _app_id: appId }).throwOnError();
  } catch {
    // Silent fail
  }
};

export const decrementHearts = async (appId: string) => {
  try {
    await supabase.rpc("decrement_hearts" as any, { _app_id: appId }).throwOnError();
  } catch {
    // Silent fail
  }
};

export const fetchAllStats = async (): Promise<Record<string, { hearts: number; tryouts: number }>> => {
  try {
    const { data } = await supabase.from("app_stats").select("*");
    const map: Record<string, { hearts: number; tryouts: number }> = {};
    data?.forEach((row: any) => {
      map[row.app_id] = { hearts: row.hearts, tryouts: row.tryouts };
    });
    return map;
  } catch {
    return {};
  }
};

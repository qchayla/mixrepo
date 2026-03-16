CREATE OR REPLACE FUNCTION public.increment_tryouts(_app_id TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE app_stats SET tryouts = tryouts + 1 WHERE app_id = _app_id;
$$;

CREATE OR REPLACE FUNCTION public.increment_hearts(_app_id TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE app_stats SET hearts = hearts + 1 WHERE app_id = _app_id;
$$;

CREATE OR REPLACE FUNCTION public.decrement_hearts(_app_id TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE app_stats SET hearts = GREATEST(hearts - 1, 0) WHERE app_id = _app_id;
$$;

-- Now we can tighten the INSERT/UPDATE policies since we use security definer functions
DROP POLICY IF EXISTS "Anyone can insert app_stats" ON public.app_stats;
DROP POLICY IF EXISTS "Anyone can update app_stats" ON public.app_stats;
CREATE TABLE public.app_stats (
  app_id TEXT PRIMARY KEY,
  hearts INTEGER NOT NULL DEFAULT 0,
  tryouts INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.app_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app_stats" ON public.app_stats FOR SELECT USING (true);
CREATE POLICY "Anyone can insert app_stats" ON public.app_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update app_stats" ON public.app_stats FOR UPDATE USING (true);

INSERT INTO public.app_stats (app_id, hearts, tryouts) VALUES
  ('stock-tracker', 42, 318),
  ('invoice-maker', 128, 1024),
  ('shift-scheduler', 27, 156),
  ('expense-log', 65, 492),
  ('menu-builder', 89, 673),
  ('attendance-app', 34, 201),
  ('pos-lite', 215, 1893),
  ('booking-page', 18, 94);
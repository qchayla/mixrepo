-- Create apps table
CREATE TABLE public.apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  repo TEXT NOT NULL,
  screenshot TEXT NOT NULL DEFAULT '',
  templates TEXT[] NOT NULL DEFAULT '{}',
  type TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create remixes table
CREATE TABLE public.remixes (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES public.apps(id),
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  use_case TEXT NOT NULL,
  url TEXT NOT NULL,
  repo TEXT NOT NULL,
  tryouts INTEGER NOT NULL DEFAULT 0
);

-- RLS for apps
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read apps" ON public.apps FOR SELECT USING (true);
CREATE POLICY "Anyone can insert apps" ON public.apps FOR INSERT WITH CHECK (true);

-- RLS for remixes
ALTER TABLE public.remixes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read remixes" ON public.remixes FOR SELECT USING (true);

-- Add INSERT policy on app_stats (needed for new app submissions)
CREATE POLICY "Anyone can insert app_stats" ON public.app_stats FOR INSERT WITH CHECK (true);

-- Seed apps
INSERT INTO public.apps (id, name, url, repo, screenshot, templates, type, description) VALUES
  ('stock-tracker', 'Stock Tracker', 'https://stock-tracker-demo.lovable.app', 'https://github.com/user/stock-tracker', '', ARRAY['restaurant','retail','pharmacy'], ARRAY['New','Editor Choice'], 'Track inventory levels in real-time with barcode scanning support. Scan items with your phone camera, get instant stock counts, and receive low-stock alerts before you run out. Supports multiple locations, batch imports via CSV, and generates weekly inventory reports with trend analysis. Perfect for small retail shops, restaurants managing ingredients, and pharmacies tracking medicine stock levels across shelves.'),
  ('invoice-maker', 'Invoice Maker', 'https://invoice-maker-demo.lovable.app', 'https://github.com/user/invoice-maker', '', ARRAY['freelancer','retail','services'], ARRAY['Hot'], 'Create and send professional invoices in seconds. Choose from beautiful templates, add your logo and brand colors, and email invoices directly to clients. Supports multiple currencies, automatic tax calculation, and payment tracking with overdue reminders. Generate PDF exports, view monthly revenue dashboards, and keep a searchable archive of all your invoices. Ideal for freelancers, consultants, and small service businesses.'),
  ('shift-scheduler', 'Shift Scheduler', 'https://shift-scheduler-demo.lovable.app', 'https://github.com/user/shift-scheduler', '', ARRAY['restaurant','retail','clinic'], ARRAY['New'], 'Schedule employee shifts with drag-and-drop simplicity. Build weekly rosters in minutes, handle swap requests, and send automatic notifications when shifts change. Tracks overtime, prevents double-booking, and shows coverage gaps at a glance. Employees get their own view to check upcoming shifts, request time off, and swap with colleagues. Export schedules to PDF or sync with Google Calendar for seamless team coordination.'),
  ('expense-log', 'Expense Log', 'https://expense-log-demo.lovable.app', 'https://github.com/user/expense-log', '', ARRAY['restaurant','retail','school'], ARRAY['Editor Choice'], 'Log daily expenses and get weekly spending reports with visual breakdowns. Snap receipts with your camera for automatic data extraction, categorize spending across custom categories, and set monthly budgets with real-time progress tracking. Compare spending across weeks and months with interactive charts. Supports multi-user access for team expense tracking, CSV export for accountants, and recurring expense automation.'),
  ('menu-builder', 'Menu Builder', 'https://menu-builder-demo.lovable.app', 'https://github.com/user/menu-builder', '', ARRAY['restaurant','cafe','bar'], ARRAY['Hot','New'], 'Build beautiful digital menus with QR code sharing. Upload food photos, set prices with seasonal variations, and organize items into categories with drag-and-drop. Generate printable QR codes that link to your always-up-to-date digital menu. Supports allergen labels, dietary filters (vegan, halal, gluten-free), and multi-language translations. Update prices or mark items as sold out instantly — no reprinting needed.'),
  ('attendance-app', 'Attendance App', 'https://attendance-demo.lovable.app', 'https://github.com/user/attendance-app', '', ARRAY['school','clinic','retail'], ARRAY[]::TEXT[], 'Track student or employee attendance with one tap. Simple check-in/check-out interface with optional GPS verification and photo capture. View daily, weekly, and monthly attendance summaries with absence patterns highlighted. Send automatic notifications to parents or managers for absences. Supports multiple classes or departments, late arrival tracking, and exportable attendance reports for compliance and payroll.'),
  ('pos-lite', 'POS Lite', 'https://pos-lite-demo.lovable.app', 'https://github.com/user/pos-lite', '', ARRAY['retail','restaurant','market'], ARRAY['Hot','Editor Choice'], 'Lightweight point-of-sale for small shops and stalls. Ring up sales with a tap, accept cash or card payments, and print or text receipts. Works offline for market stalls and syncs when back online. Features include product catalog management, barcode scanning, daily sales summaries, and end-of-day cash drawer reconciliation. Add customer profiles for loyalty tracking and view sales analytics with top-selling products and peak hours.'),
  ('booking-page', 'Booking Page', 'https://booking-page-demo.lovable.app', 'https://github.com/user/booking-page', '', ARRAY['clinic','salon','services'], ARRAY['New'], 'Let customers book appointments online 24/7. Set your available hours, service durations, and buffer times between appointments. Customers pick a slot, enter their details, and receive instant confirmation with calendar invites. Automatic reminders reduce no-shows by up to 40%. Supports multiple staff members, service categories, and custom intake forms. Embed on your website or share as a standalone booking link.');

-- Seed remixes
INSERT INTO public.remixes (id, app_id, author, description, features, use_case, url, repo, tryouts) VALUES
  ('st-r1', 'stock-tracker', 'Maria Santos', 'Added expiry date tracking for perishables', ARRAY['Expiry alerts','FIFO sorting','Batch tracking'], 'Grocery Store', 'https://stock-tracker-grocery.lovable.app', 'https://github.com/maria/stock-tracker-grocery', 87),
  ('st-r2', 'stock-tracker', 'Ahmad Rizal', 'Medicine inventory with supplier management', ARRAY['Supplier contacts','Reorder alerts','Drug categories'], 'Pharmacy', 'https://stock-tracker-pharmacy.lovable.app', 'https://github.com/ahmad/stock-tracker-pharmacy', 142),
  ('st-r3', 'stock-tracker', 'Chen Wei', 'Warehouse version with multi-location support', ARRAY['Multiple warehouses','Transfer tracking','Dashboard'], 'Wholesale', 'https://stock-tracker-warehouse.lovable.app', 'https://github.com/chen/stock-tracker-warehouse', 63),
  ('im-r1', 'invoice-maker', 'Priya Sharma', 'Added GST tax calculation for Indian businesses', ARRAY['GST auto-calc','HSN codes','E-way bill'], 'Indian Retail', 'https://invoice-maker-gst.lovable.app', 'https://github.com/priya/invoice-maker-gst', 234),
  ('im-r2', 'invoice-maker', 'Budi Santoso', 'Recurring invoice support for subscription services', ARRAY['Auto-send monthly','Payment reminders','Late fees'], 'SaaS / Services', 'https://invoice-maker-recurring.lovable.app', 'https://github.com/budi/invoice-maker-recurring', 178),
  ('im-r3', 'invoice-maker', 'Linh Nguyen', 'Multi-currency support for export businesses', ARRAY['Currency converter','Exchange rates','Dual-currency display'], 'Export Business', 'https://invoice-maker-multicurrency.lovable.app', 'https://github.com/linh/invoice-maker-multicurrency', 95),
  ('mb-r1', 'menu-builder', 'Kai Tanaka', 'Added allergen labels and dietary filters', ARRAY['Allergen icons','Vegan/Halal filters','Nutritional info'], 'Health-Conscious Café', 'https://menu-builder-allergen.lovable.app', 'https://github.com/kai/menu-builder-allergen', 156),
  ('mb-r2', 'menu-builder', 'Rosa Garcia', 'Happy hour pricing with time-based menus', ARRAY['Time-based prices','Combo deals','Seasonal items'], 'Bar & Restaurant', 'https://menu-builder-happyhour.lovable.app', 'https://github.com/rosa/menu-builder-happyhour', 112),
  ('pl-r1', 'pos-lite', 'Somchai T.', 'Market stall version with offline mode', ARRAY['Offline sales','Daily summary SMS','Simple receipt'], 'Street Market', 'https://pos-lite-market.lovable.app', 'https://github.com/somchai/pos-lite-market', 321),
  ('pl-r2', 'pos-lite', 'Dewi Ayu', 'Added loyalty points and customer tracking', ARRAY['Points system','Customer profiles','Reward redemption'], 'Retail Shop', 'https://pos-lite-loyalty.lovable.app', 'https://github.com/dewi/pos-lite-loyalty', 267),
  ('pl-r3', 'pos-lite', 'Jay Park', 'Food court version with table ordering', ARRAY['Table numbers','Kitchen display','Order queue'], 'Food Court', 'https://pos-lite-foodcourt.lovable.app', 'https://github.com/jay/pos-lite-foodcourt', 198);

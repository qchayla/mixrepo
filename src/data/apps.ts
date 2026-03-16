export interface AppMeta {
  id: string;
  name: string;
  url: string;
  repo: string;
  screenshot: string;
  templates: string[];
  type: string[];
  hearts: number;
  tryouts: number;
  description?: string;
}

export interface RemixMeta {
  id: string;
  appId: string;
  author: string;
  description: string;
  features: string[];
  useCase: string;
  url: string;
  repo: string;
  tryouts: number;
}

export const apps: AppMeta[] = [
  {
    id: "stock-tracker",
    name: "Stock Tracker",
    url: "https://stock-tracker-demo.lovable.app",
    repo: "https://github.com/user/stock-tracker",
    screenshot: "",
    templates: ["restaurant", "retail", "pharmacy"],
    type: ["New", "Editor Choice"],
    hearts: 42,
    tryouts: 318,
    description: "Track inventory levels in real-time with barcode scanning support. Scan items with your phone camera, get instant stock counts, and receive low-stock alerts before you run out. Supports multiple locations, batch imports via CSV, and generates weekly inventory reports with trend analysis. Perfect for small retail shops, restaurants managing ingredients, and pharmacies tracking medicine stock levels across shelves."
  },
  {
    id: "invoice-maker",
    name: "Invoice Maker",
    url: "https://invoice-maker-demo.lovable.app",
    repo: "https://github.com/user/invoice-maker",
    screenshot: "",
    templates: ["freelancer", "retail", "services"],
    type: ["Hot"],
    hearts: 128,
    tryouts: 1024,
    description: "Create and send professional invoices in seconds. Choose from beautiful templates, add your logo and brand colors, and email invoices directly to clients. Supports multiple currencies, automatic tax calculation, and payment tracking with overdue reminders. Generate PDF exports, view monthly revenue dashboards, and keep a searchable archive of all your invoices. Ideal for freelancers, consultants, and small service businesses."
  },
  {
    id: "shift-scheduler",
    name: "Shift Scheduler",
    url: "https://shift-scheduler-demo.lovable.app",
    repo: "https://github.com/user/shift-scheduler",
    screenshot: "",
    templates: ["restaurant", "retail", "clinic"],
    type: ["New"],
    hearts: 27,
    tryouts: 156,
    description: "Schedule employee shifts with drag-and-drop simplicity. Build weekly rosters in minutes, handle swap requests, and send automatic notifications when shifts change. Tracks overtime, prevents double-booking, and shows coverage gaps at a glance. Employees get their own view to check upcoming shifts, request time off, and swap with colleagues. Export schedules to PDF or sync with Google Calendar for seamless team coordination."
  },
  {
    id: "expense-log",
    name: "Expense Log",
    url: "https://expense-log-demo.lovable.app",
    repo: "https://github.com/user/expense-log",
    screenshot: "",
    templates: ["restaurant", "retail", "school"],
    type: ["Editor Choice"],
    hearts: 65,
    tryouts: 492,
    description: "Log daily expenses and get weekly spending reports with visual breakdowns. Snap receipts with your camera for automatic data extraction, categorize spending across custom categories, and set monthly budgets with real-time progress tracking. Compare spending across weeks and months with interactive charts. Supports multi-user access for team expense tracking, CSV export for accountants, and recurring expense automation."
  },
  {
    id: "menu-builder",
    name: "Menu Builder",
    url: "https://menu-builder-demo.lovable.app",
    repo: "https://github.com/user/menu-builder",
    screenshot: "",
    templates: ["restaurant", "cafe", "bar"],
    type: ["Hot", "New"],
    hearts: 89,
    tryouts: 673,
    description: "Build beautiful digital menus with QR code sharing. Upload food photos, set prices with seasonal variations, and organize items into categories with drag-and-drop. Generate printable QR codes that link to your always-up-to-date digital menu. Supports allergen labels, dietary filters (vegan, halal, gluten-free), and multi-language translations. Update prices or mark items as sold out instantly — no reprinting needed."
  },
  {
    id: "attendance-app",
    name: "Attendance App",
    url: "https://attendance-demo.lovable.app",
    repo: "https://github.com/user/attendance-app",
    screenshot: "",
    templates: ["school", "clinic", "retail"],
    type: [],
    hearts: 34,
    tryouts: 201,
    description: "Track student or employee attendance with one tap. Simple check-in/check-out interface with optional GPS verification and photo capture. View daily, weekly, and monthly attendance summaries with absence patterns highlighted. Send automatic notifications to parents or managers for absences. Supports multiple classes or departments, late arrival tracking, and exportable attendance reports for compliance and payroll."
  },
  {
    id: "pos-lite",
    name: "POS Lite",
    url: "https://pos-lite-demo.lovable.app",
    repo: "https://github.com/user/pos-lite",
    screenshot: "",
    templates: ["retail", "restaurant", "market"],
    type: ["Hot", "Editor Choice"],
    hearts: 215,
    tryouts: 1893,
    description: "Lightweight point-of-sale for small shops and stalls. Ring up sales with a tap, accept cash or card payments, and print or text receipts. Works offline for market stalls and syncs when back online. Features include product catalog management, barcode scanning, daily sales summaries, and end-of-day cash drawer reconciliation. Add customer profiles for loyalty tracking and view sales analytics with top-selling products and peak hours."
  },
  {
    id: "booking-page",
    name: "Booking Page",
    url: "https://booking-page-demo.lovable.app",
    repo: "https://github.com/user/booking-page",
    screenshot: "",
    templates: ["clinic", "salon", "services"],
    type: ["New"],
    hearts: 18,
    tryouts: 94,
    description: "Let customers book appointments online 24/7. Set your available hours, service durations, and buffer times between appointments. Customers pick a slot, enter their details, and receive instant confirmation with calendar invites. Automatic reminders reduce no-shows by up to 40%. Supports multiple staff members, service categories, and custom intake forms. Embed on your website or share as a standalone booking link."
  }
];

export const remixes: RemixMeta[] = [
  { id: "st-r1", appId: "stock-tracker", author: "Maria Santos", description: "Added expiry date tracking for perishables", features: ["Expiry alerts", "FIFO sorting", "Batch tracking"], useCase: "Grocery Store", url: "https://stock-tracker-grocery.lovable.app", repo: "https://github.com/maria/stock-tracker-grocery", tryouts: 87 },
  { id: "st-r2", appId: "stock-tracker", author: "Ahmad Rizal", description: "Medicine inventory with supplier management", features: ["Supplier contacts", "Reorder alerts", "Drug categories"], useCase: "Pharmacy", url: "https://stock-tracker-pharmacy.lovable.app", repo: "https://github.com/ahmad/stock-tracker-pharmacy", tryouts: 142 },
  { id: "st-r3", appId: "stock-tracker", author: "Chen Wei", description: "Warehouse version with multi-location support", features: ["Multiple warehouses", "Transfer tracking", "Dashboard"], useCase: "Wholesale", url: "https://stock-tracker-warehouse.lovable.app", repo: "https://github.com/chen/stock-tracker-warehouse", tryouts: 63 },
  { id: "im-r1", appId: "invoice-maker", author: "Priya Sharma", description: "Added GST tax calculation for Indian businesses", features: ["GST auto-calc", "HSN codes", "E-way bill"], useCase: "Indian Retail", url: "https://invoice-maker-gst.lovable.app", repo: "https://github.com/priya/invoice-maker-gst", tryouts: 234 },
  { id: "im-r2", appId: "invoice-maker", author: "Budi Santoso", description: "Recurring invoice support for subscription services", features: ["Auto-send monthly", "Payment reminders", "Late fees"], useCase: "SaaS / Services", url: "https://invoice-maker-recurring.lovable.app", repo: "https://github.com/budi/invoice-maker-recurring", tryouts: 178 },
  { id: "im-r3", appId: "invoice-maker", author: "Linh Nguyen", description: "Multi-currency support for export businesses", features: ["Currency converter", "Exchange rates", "Dual-currency display"], useCase: "Export Business", url: "https://invoice-maker-multicurrency.lovable.app", repo: "https://github.com/linh/invoice-maker-multicurrency", tryouts: 95 },
  { id: "mb-r1", appId: "menu-builder", author: "Kai Tanaka", description: "Added allergen labels and dietary filters", features: ["Allergen icons", "Vegan/Halal filters", "Nutritional info"], useCase: "Health-Conscious Café", url: "https://menu-builder-allergen.lovable.app", repo: "https://github.com/kai/menu-builder-allergen", tryouts: 156 },
  { id: "mb-r2", appId: "menu-builder", author: "Rosa Garcia", description: "Happy hour pricing with time-based menus", features: ["Time-based prices", "Combo deals", "Seasonal items"], useCase: "Bar & Restaurant", url: "https://menu-builder-happyhour.lovable.app", repo: "https://github.com/rosa/menu-builder-happyhour", tryouts: 112 },
  { id: "pl-r1", appId: "pos-lite", author: "Somchai T.", description: "Market stall version with offline mode", features: ["Offline sales", "Daily summary SMS", "Simple receipt"], useCase: "Street Market", url: "https://pos-lite-market.lovable.app", repo: "https://github.com/somchai/pos-lite-market", tryouts: 321 },
  { id: "pl-r2", appId: "pos-lite", author: "Dewi Ayu", description: "Added loyalty points and customer tracking", features: ["Points system", "Customer profiles", "Reward redemption"], useCase: "Retail Shop", url: "https://pos-lite-loyalty.lovable.app", repo: "https://github.com/dewi/pos-lite-loyalty", tryouts: 267 },
  { id: "pl-r3", appId: "pos-lite", author: "Jay Park", description: "Food court version with table ordering", features: ["Table numbers", "Kitchen display", "Order queue"], useCase: "Food Court", url: "https://pos-lite-foodcourt.lovable.app", repo: "https://github.com/jay/pos-lite-foodcourt", tryouts: 198 },
];

export const getAllTemplates = (): string[] => {
  const templates = new Set<string>();
  apps.forEach(app => app.templates.forEach(t => templates.add(t)));
  return Array.from(templates);
};

export const getAllTypes = (): string[] => {
  const types = new Set<string>();
  apps.forEach(app => app.type.forEach(t => types.add(t)));
  return Array.from(types);
};

export const getRemixesForApp = (appId: string): RemixMeta[] => {
  return remixes.filter(r => r.appId === appId);
};

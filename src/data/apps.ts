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
    description: "Track inventory levels in real-time with barcode scanning support."
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
    description: "Create and send professional invoices in seconds."
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
    description: "Schedule employee shifts with drag-and-drop simplicity."
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
    description: "Log daily expenses and get weekly spending reports."
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
    description: "Build beautiful digital menus with QR code sharing."
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
    description: "Track student or employee attendance with one tap."
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
    description: "Lightweight point-of-sale for small shops and stalls."
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
    description: "Let customers book appointments online 24/7."
  }
];

export const remixes: RemixMeta[] = [
  // stock-tracker remixes
  { id: "st-r1", appId: "stock-tracker", author: "Maria Santos", description: "Added expiry date tracking for perishables", features: ["Expiry alerts", "FIFO sorting", "Batch tracking"], useCase: "Grocery Store", url: "https://stock-tracker-grocery.lovable.app", repo: "https://github.com/maria/stock-tracker-grocery", tryouts: 87 },
  { id: "st-r2", appId: "stock-tracker", author: "Ahmad Rizal", description: "Medicine inventory with supplier management", features: ["Supplier contacts", "Reorder alerts", "Drug categories"], useCase: "Pharmacy", url: "https://stock-tracker-pharmacy.lovable.app", repo: "https://github.com/ahmad/stock-tracker-pharmacy", tryouts: 142 },
  { id: "st-r3", appId: "stock-tracker", author: "Chen Wei", description: "Warehouse version with multi-location support", features: ["Multiple warehouses", "Transfer tracking", "Dashboard"], useCase: "Wholesale", url: "https://stock-tracker-warehouse.lovable.app", repo: "https://github.com/chen/stock-tracker-warehouse", tryouts: 63 },
  // invoice-maker remixes
  { id: "im-r1", appId: "invoice-maker", author: "Priya Sharma", description: "Added GST tax calculation for Indian businesses", features: ["GST auto-calc", "HSN codes", "E-way bill"], useCase: "Indian Retail", url: "https://invoice-maker-gst.lovable.app", repo: "https://github.com/priya/invoice-maker-gst", tryouts: 234 },
  { id: "im-r2", appId: "invoice-maker", author: "Budi Santoso", description: "Recurring invoice support for subscription services", features: ["Auto-send monthly", "Payment reminders", "Late fees"], useCase: "SaaS / Services", url: "https://invoice-maker-recurring.lovable.app", repo: "https://github.com/budi/invoice-maker-recurring", tryouts: 178 },
  { id: "im-r3", appId: "invoice-maker", author: "Linh Nguyen", description: "Multi-currency support for export businesses", features: ["Currency converter", "Exchange rates", "Dual-currency display"], useCase: "Export Business", url: "https://invoice-maker-multicurrency.lovable.app", repo: "https://github.com/linh/invoice-maker-multicurrency", tryouts: 95 },
  // menu-builder remixes
  { id: "mb-r1", appId: "menu-builder", author: "Kai Tanaka", description: "Added allergen labels and dietary filters", features: ["Allergen icons", "Vegan/Halal filters", "Nutritional info"], useCase: "Health-Conscious Café", url: "https://menu-builder-allergen.lovable.app", repo: "https://github.com/kai/menu-builder-allergen", tryouts: 156 },
  { id: "mb-r2", appId: "menu-builder", author: "Rosa Garcia", description: "Happy hour pricing with time-based menus", features: ["Time-based prices", "Combo deals", "Seasonal items"], useCase: "Bar & Restaurant", url: "https://menu-builder-happyhour.lovable.app", repo: "https://github.com/rosa/menu-builder-happyhour", tryouts: 112 },
  // pos-lite remixes
  { id: "pl-r1", appId: "pos-lite", author: "Somchai T.", description: "Market stall version with offline mode", features: ["Offline sales", "Daily summary SMS", "Simple receipt"], useCase: "Street Market", url: "https://pos-lite-market.lovable.app", repo: "https://github.com/somchai/pos-lite-market", tryouts: 321 },
  { id: "pl-r2", appId: "pos-lite", author: "Dewi Ayu", description: "Added loyalty points and customer tracking", features: ["Points system", "Customer profiles", "Reward redemption"], useCase: "Retail Shop", url: "https://pos-lite-loyalty.lovable.app", repo: "https://github.com/dewi/pos-lite-loyalty", tryouts: 267 },
  { id: "pl-r3", appId: "pos-lite", author: "Jay Park", description: "Food court version with table ordering", features: ["Table numbers", "Kitchen display", "Order queue"], useCase: "Food Court", url: "https://pos-lite-foodcourt.lovable.app", repo: "https://github.com/jay/pos-lite-foodcourt", tryouts: 198 },
];

// Get all unique templates across apps for category filter
export const getAllTemplates = (): string[] => {
  const templates = new Set<string>();
  apps.forEach(app => app.templates.forEach(t => templates.add(t)));
  return Array.from(templates);
};

// Get all unique types across apps for type filter
export const getAllTypes = (): string[] => {
  const types = new Set<string>();
  apps.forEach(app => app.type.forEach(t => types.add(t)));
  return Array.from(types);
};

export const getRemixesForApp = (appId: string): RemixMeta[] => {
  return remixes.filter(r => r.appId === appId);
};

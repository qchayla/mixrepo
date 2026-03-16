export interface Platform {
  id: string;
  name: string;
  steps: string[];
  starterPrompt: string;
}

export interface PromptCard {
  id: string;
  title: string;
  useCase: string;
  businessType: string;
  prompt: string;
}

export const platforms: Platform[] = [
  {
    id: "bolt",
    name: "Bolt.new",
    steps: [
      "Go to bolt.new and start a new project",
      "Paste the copied prompt into the chat — Bolt will pull the repo and set it up",
      "Click 'Deploy' when ready to publish your tool"
    ],
    starterPrompt: "Pull this GitHub repo and deploy it as a web app. Keep the existing design and make it mobile-friendly. Add a simple setup guide on first load."
  },
  {
    id: "lovable",
    name: "Lovable",
    steps: [
      "Open lovable.dev and create a new project",
      "Paste the copied prompt — Lovable will import and customize the tool",
      "Hit 'Publish' to get a live URL you can share"
    ],
    starterPrompt: "Import this GitHub repo into a new Lovable project. Preserve the UI, connect a database for data persistence, and deploy it."
  },
  {
    id: "replit",
    name: "Replit",
    steps: [
      "Go to replit.com and click 'Create Repl'",
      "Choose 'Import from GitHub' and paste the repo URL",
      "Click 'Run' to start the app, then use 'Deploy' for a permanent link"
    ],
    starterPrompt: "Import this GitHub repository, install dependencies, and run it. Make sure the app is accessible on the public URL."
  },
  {
    id: "cursor",
    name: "Cursor",
    steps: [
      "Open Cursor IDE and clone the repo using the terminal",
      "Open the project folder and use Cursor's AI to customize",
      "Deploy using Vercel, Netlify, or any static host"
    ],
    starterPrompt: "Clone this repo, review the codebase, and help me customize it for my business. Start by showing me what I can change."
  }
];

export const promptLibrary: PromptCard[] = [
  {
    id: "p1",
    title: "Restaurant Daily Sales Tracker",
    useCase: "Track daily revenue by meal period",
    businessType: "restaurant",
    prompt: "Build me a daily sales tracker for my restaurant. I need to log breakfast, lunch, and dinner revenue separately. Show a weekly bar chart and highlight my best day. Keep it simple — one page, mobile-friendly."
  },
  {
    id: "p2",
    title: "Retail Inventory Alert System",
    useCase: "Get notified when stock runs low",
    businessType: "retail",
    prompt: "Create a stock alert system for my small retail shop. I want to set minimum quantities for each product. When stock drops below the minimum, show a red warning. Include a simple restock button that resets the count."
  },
  {
    id: "p3",
    title: "School Fee Collection Tracker",
    useCase: "Track which students have paid monthly fees",
    businessType: "school",
    prompt: "Build a fee collection tracker for my school. List students by class, show paid/unpaid status for each month. Let me tap to mark as paid. Show total collected vs outstanding at the top."
  },
  {
    id: "p4",
    title: "Salon Appointment Booker",
    useCase: "Let customers pick a time slot online",
    businessType: "salon",
    prompt: "Create a simple booking page for my salon. Show available time slots for today and tomorrow. Customers fill in their name and phone number to book. I see all bookings in a list view."
  },
  {
    id: "p5",
    title: "Clinic Patient Queue",
    useCase: "Manage walk-in patient waiting list",
    businessType: "clinic",
    prompt: "Build a patient queue system for my clinic. Patients register with name and phone at the front desk. Show queue number and estimated wait time. Doctors can call next patient with one button."
  },
  {
    id: "p6",
    title: "Market Stall Daily Log",
    useCase: "Record daily sales and expenses for market vendors",
    businessType: "market",
    prompt: "Create a daily log for my market stall. I enter what I sold and how much I spent (supplies, transport). Show my profit for today and this week. Works offline — saves data on my phone."
  }
];

export const getBusinessTypes = (): string[] => {
  const types = new Set<string>();
  promptLibrary.forEach(p => types.add(p.businessType));
  return Array.from(types);
};

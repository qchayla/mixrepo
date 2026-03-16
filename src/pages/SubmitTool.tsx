import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const SubmitTool = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", repo: "", description: "", category: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.repo) {
      toast.error("Please fill in tool name and repo URL");
      return;
    }
    setSubmitted(true);
    toast.success("Tool submitted! We'll review it soon.");
  };

  const categories = ["restaurant", "retail", "clinic", "school", "salon", "market", "services", "other"];

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-4 py-3 border-b border-border/50">
          <button className="flex items-center gap-2 text-sm font-semibold font-display active:opacity-70" onClick={() => navigate("/")}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>
        <div className="flex flex-col items-center justify-center px-6 pt-24 text-center">
          <div className="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-lg font-bold font-display mb-2">Tool Submitted!</h2>
          <p className="text-sm text-muted-foreground mb-6">Thanks for sharing! We'll review your tool and add it to the gallery soon.</p>
          <button className="bg-gradient-to-r from-primary to-electric text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-transform glow-primary" onClick={() => navigate("/")}>
            Back to Gallery
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <button className="flex items-center gap-2 text-sm font-semibold font-display active:opacity-70" onClick={() => navigate("/")}>
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="px-4 py-4">
        <h1 className="text-lg font-bold font-display">Submit Your Tool</h1>
        <p className="text-sm text-muted-foreground mt-1">Share a micro-tool you built. We'll review and add it to the gallery.</p>

        <div className="flex flex-col gap-4 mt-6">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tool Name *</label>
            <input type="text" placeholder="e.g. Stock Tracker" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full glass rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">GitHub Repo URL *</label>
            <input type="url" placeholder="https://github.com/you/your-tool" value={form.repo} onChange={(e) => setForm({ ...form, repo: e.target.value })} className="w-full glass rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Short Description</label>
            <textarea placeholder="What does your tool do? (one sentence)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full glass rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat} className={`text-xs px-3.5 py-1.5 rounded-full font-semibold capitalize transition-all duration-200 ${form.category === cat ? "bg-primary text-primary-foreground glow-primary" : "glass text-secondary-foreground"}`} onClick={() => setForm({ ...form, category: form.category === cat ? "" : cat })}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-electric text-primary-foreground py-3.5 rounded-xl text-sm font-semibold active:scale-95 transition-transform mt-2 glow-primary" onClick={handleSubmit}>
            <Send size={14} /> Submit Tool
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SubmitTool;

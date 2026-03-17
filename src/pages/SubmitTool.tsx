import { useState } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitToolSchema, SubmitToolFormData } from "@/lib/schemas";
import { submitApp } from "@/lib/apps";
import BottomNav from "@/components/BottomNav";

const SubmitTool = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubmitToolFormData>({
    resolver: zodResolver(submitToolSchema),
    defaultValues: { name: "", repo: "", description: "", category: "" },
  });

  const selectedCategory = watch("category");

  const mutation = useMutation({
    mutationFn: submitApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setSubmitted(true);
      toast.success("Tool submitted! It's now live in the gallery.");
    },
    onError: (err: Error) => {
      toast.error(`Submission failed: ${err.message}`);
    },
  });

  const onSubmit = (data: SubmitToolFormData) => {
    mutation.mutate({
      name: data.name,
      repo: data.repo,
      description: data.description || undefined,
      category: data.category || undefined,
    });
  };

  const categories = ["restaurant", "retail", "clinic", "school", "salon", "market", "services", "other"];

  if (submitted) {
    return (
      <div className="min-h-screen pb-20">
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
          <p className="text-sm text-muted-foreground mb-6">Thanks for sharing! Your tool is now live in the gallery.</p>
          <button className="bg-gradient-to-r from-primary to-electric text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-transform glow-primary" onClick={() => navigate("/")}>
            Back to Gallery
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/50 px-4 py-3" style={{ background: "hsl(var(--glass-bg))" }}>
        <button className="flex items-center gap-2 text-sm font-semibold font-display active:opacity-70" onClick={() => navigate("/")}>
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="px-4 py-4">
        <h1 className="text-lg font-bold font-display">Submit Your Tool</h1>
        <p className="text-sm text-muted-foreground mt-1">Share a micro-tool you built. It will appear in the gallery immediately.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tool Name *</label>
            <input
              type="text"
              placeholder="e.g. Stock Tracker"
              {...register("name")}
              className="w-full glass rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">GitHub Repo URL *</label>
            <input
              type="url"
              placeholder="https://github.com/you/your-tool"
              {...register("repo")}
              className="w-full glass rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.repo && (
              <p className="text-xs text-destructive mt-1">{errors.repo.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Short Description</label>
            <textarea
              placeholder="What does your tool do? (one sentence)"
              {...register("description")}
              rows={2}
              className="w-full glass rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold capitalize transition-all duration-200 ${
                    selectedCategory === cat ? "bg-primary text-primary-foreground glow-primary" : "glass text-secondary-foreground"
                  }`}
                  onClick={() => setValue("category", selectedCategory === cat ? "" : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-electric text-primary-foreground py-3.5 rounded-xl text-sm font-semibold active:scale-95 transition-transform mt-2 glow-primary disabled:opacity-60 disabled:active:scale-100"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={14} />
                Submit Tool
              </>
            )}
          </button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
};

export default SubmitTool;

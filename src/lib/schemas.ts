import { z } from "zod";

export const submitToolSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  repo: z
    .string()
    .url("Must be a valid URL")
    .refine((val) => val.includes("github.com"), {
      message: "Must be a GitHub URL",
    }),
  description: z.string().max(500, "Description must be under 500 characters").optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
});

export type SubmitToolFormData = z.infer<typeof submitToolSchema>;

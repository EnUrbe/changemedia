import { z } from "zod";
import { httpsUrlSchema } from "./contentSchema";

export const deliverableSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["video", "gallery", "document", "audio", "link"]),
  title: z.string().min(1),
  description: z.string().min(1),
  url: httpsUrlSchema,
  thumbnail: httpsUrlSchema.optional(),
  status: z.enum(["ready", "needs-review", "in-progress", "archived"]),
});

export const feedbackSchema = z.object({
  id: z.string().min(1),
  author: z.string().min(1),
  role: z.string().min(1),
  message: z.string().min(1),
  timestamp: z.string().min(1),
});

export const projectSchema = z.object({
  id: z.string().min(1),
  clientName: z.string().min(1),
  projectTitle: z.string().min(1),
  status: z.enum(["planning", "in-production", "in-review", "approved", "delivered"]),
  summary: z.string().min(1),
  dueDate: z.string().min(1),
  pointOfContact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
  accessCode: z.string().min(6),
  deliverables: deliverableSchema.array(),
  feedback: feedbackSchema.array(),
  checklist: z.array(z.string().min(1)).default([]),
  aiNotes: z.string().optional(),
});

export const projectsFileSchema = z.object({
  projects: projectSchema.array(),
});

export type Deliverable = z.infer<typeof deliverableSchema>;
export type FeedbackNote = z.infer<typeof feedbackSchema>;
export type ClientProject = z.infer<typeof projectSchema>;

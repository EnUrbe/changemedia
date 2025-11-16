import { z } from "zod";

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "secondary", "ghost"]).default("primary"),
});

const statsSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const imageRefSchema = z
  .object({
    src: z.string().url().optional(),
    publicId: z.string().optional(),
    alt: z.string().optional(),
    aspectRatio: z.string().optional(),
    transformation: z.string().optional(),
  })
  .refine((val) => Boolean(val.src || val.publicId), {
    message: "Image reference must include a src or publicId",
  });

const layoutHintSchema = z.object({
  colSpan: z.number().int().min(1).max(12).optional(),
  rowSpan: z.number().int().min(1).max(3).optional(),
});

const portfolioItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  summary: z.string().optional(),
  image: imageRefSchema,
  layout: layoutHintSchema.optional(),
});

const servicePlanSchema = z.object({
  id: z.string(),
  numeral: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.string(),
  periodLabel: z.string(),
  features: z.array(z.string()).min(1),
  surface: z.string().optional(),
  border: z.string().optional(),
  buttonLabel: z.string().default("Reserve time"),
});

const calloutSchema = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  description: z.string(),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
});

export const photographyContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    availability: z.string(),
    title: z.string(),
    highlight: z.string(),
    subtitle: z.string(),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema.optional(),
    stats: z.array(statsSchema).min(1),
  }),
  portfolio: z.array(portfolioItemSchema).min(1),
  services: z.array(servicePlanSchema).min(1),
  cta: calloutSchema,
  seo: z.object({
    title: z.string(),
    description: z.string(),
    ogImage: z.string().url(),
  }),
  media: z
    .object({
      delivery: z.enum(["external", "cloudinary"]).default("external"),
      cloudinary: z
        .object({
          cloudName: z.string(),
          deliveryType: z.enum(["image", "video", "raw", "authenticated", "fetch", "youtube", "facebook", "twitter", "vimeo", "sprite"]).default("image"),
          folder: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type PhotographyContent = z.infer<typeof photographyContentSchema>;
export type PortfolioItem = z.infer<typeof portfolioItemSchema>;

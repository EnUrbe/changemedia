import { z } from "zod";

const httpsUrl = z
  .string()
  .url();
  // .refine((value: string) => value.startsWith("https://"), {
  //   message: "URL must use https://",
  // });

export const httpsUrlSchema = httpsUrl;

const ctaVariantSchema = z.enum(["primary", "secondary", "ghost"]);

export const heroSchema = z.object({
  eyebrow: z.string().min(1),
  locationPill: z.string().min(1),
  title: z.string().min(1),
  titleGradient: z.string().min(1),
  subtitle: z.string().min(1),
  ctas: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
        variant: ctaVariantSchema,
      })
    )
    .min(1),
  metrics: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      })
    )
    .min(1),
});

export const marqueeSchema = z.object({
  phrases: z.array(z.string().min(1)).min(1),
});

export const logoCloudSchema = z.object({
  heading: z.string().min(1),
  logos: z
    .array(
      z.object({
        src: z.string().min(1),
        alt: z.string().min(1),
      })
    )
    .min(1),
});

export const caseStudySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  imageUrl: httpsUrl,
  videoUrl: httpsUrl.optional(),
  tags: z.array(z.string().min(1)).default([]),
});

export const featureSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const studioSchema = z.object({
  ethos: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  quote: z.string().min(1),
  attribution: z.string().min(1),
});

export const serviceCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  price: z.object({
    monthly: z.string().optional(),
    annual: z.string().optional(),
    onetime: z.string().optional(),
  }),
  bullets: z.array(z.string().min(1)).min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  group: z.enum(["studios", "portraits"]).optional(),
});

const practiceCardSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  focus: z.array(z.string().min(1)).min(1),
  accent: z.string().min(1),
  cta: z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  }),
});

const systemStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  detail: z.string().min(1),
});

const systemsContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  steps: z.array(systemStepSchema).min(1),
  outcomes: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      })
    )
    .min(1),
});

const serviceStackSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string().min(1),
  includes: z.array(z.string().min(1)).min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  avatar: httpsUrl,
  quote: z.string().min(1),
});

export const faqSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const contactSchema = z.object({
  email: z.string().email(),
  city: z.string().min(1),
  instagram: z.object({
    handle: z.string().min(1),
    url: httpsUrl,
  }),
  youtube: z.object({
    label: z.string().min(1),
    url: httpsUrl,
  }),
  calendlyUrl: httpsUrl,
});

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ogImage: httpsUrl,
});

export const changeStudiosSchema = z.object({
  hero: z.object({
    titleLine1: z.string(),
    titleLine2: z.string(),
    mission: z.string(),
    cta: z.string(),
  }),
  marquee: z.object({
    text1: z.string(),
    text2: z.string(),
  }),
  pillars: z.array(z.object({
    title: z.string(),
    desc: z.string(),
    tags: z.array(z.string()),
  })),
  showcase: z.array(z.object({
    id: z.string(),
    title: z.string(),
    category: z.string(),
    year: z.string(),
    image: z.string(),
  })),
});

export const siteContentSchema = z.object({
  hero: heroSchema,
  marquee: marqueeSchema,
  logoCloud: logoCloudSchema,
  featuredCases: z.array(caseStudySchema),
  galleryCases: z.array(caseStudySchema),
  features: z.array(featureSchema),
  studio: studioSchema,
  services: z.array(serviceCardSchema),
  practices: z.array(practiceCardSchema),
  testimonials: z.array(testimonialSchema),
  faqs: z.array(faqSchema),
  contact: contactSchema,
  systems: systemsContentSchema,
  serviceStacks: z.array(serviceStackSchema),
  seo: seoSchema,
  changeStudios: changeStudiosSchema.optional(),
  includedKit: z.string().optional(),
});

export type HeroContent = z.infer<typeof heroSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type ServiceCard = z.infer<typeof serviceCardSchema>;
export type PracticeContent = z.infer<typeof practiceCardSchema>;
export type SystemsContent = z.infer<typeof systemsContentSchema>;
export type ServiceStackContent = z.infer<typeof serviceStackSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type FaqItem = z.infer<typeof faqSchema>;
export type ContactContent = z.infer<typeof contactSchema>;

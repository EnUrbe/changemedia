import { z } from "zod";

export const gradPackageSchema = z.object({
  name: z.string(),
  price: z.number(),
  time: z.string(),
  locations: z.string(),
  images: z.string(),
  extras: z.array(z.string()),
  popular: z.boolean().optional(),
  best: z.string(),
  description: z.string().optional(),
  forWho: z.string().optional(),
  notIncluded: z.string().optional(),
  subtitle: z.string().optional(),
  savesNote: z.string().optional(),
});

export const gradAddonSchema = z.object({
  name: z.string(),
  price: z.string(),
});

export const gradGalleryItemSchema = z.object({
  title: z.string(),
  caption: z.string(),
  location: z.string(),
  image: z.string(),
});

export const gradPortfolioGalleryItemSchema = z.object({
  title: z.string(),
  image: z.string(),
});

export const gradFriendPricingSchema = z.object({
  packageName: z.string(),
  basePrice: z.number(),
  plusOne: z.object({ total: z.number(), perPerson: z.number(), savings: z.number() }),
  plusTwo: z.object({ total: z.number(), perPerson: z.number(), savings: z.number() }),
});

export const gradContentSchema = z.object({
  packages: z.array(gradPackageSchema).default([]),
  addons: z.array(gradAddonSchema).default([]),
  gallery: z.array(gradGalleryItemSchema).default([]),
  portfolioGallery: z.array(gradPortfolioGalleryItemSchema).default([]),
  friendPricing: z.array(gradFriendPricingSchema).default([]),
});

export type GradContent = z.infer<typeof gradContentSchema>;
export type GradPackage = z.infer<typeof gradPackageSchema>;
export type GradAddon = z.infer<typeof gradAddonSchema>;
export type GradGalleryItem = z.infer<typeof gradGalleryItemSchema>;
export type GradPortfolioGalleryItem = z.infer<typeof gradPortfolioGalleryItemSchema>;
export type GradFriendPricing = z.infer<typeof gradFriendPricingSchema>;

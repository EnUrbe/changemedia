import type { GradPackage, GradAddon, GradGalleryItem } from "./gradSchema";

export const DEFAULT_PACKAGES: GradPackage[] = [
  {
    name: "The Snap",
    price: 49,
    time: "10 minutes",
    locations: "1 campus location",
    images: "3 edited digital images",
    extras: [],
    best: "You just need a few solid shots for the gram and LinkedIn without overthinking it.",
  },
  {
    name: "The Portrait",
    price: 95,
    time: "20 minutes",
    locations: "1 location",
    images: "8 edited digital images",
    extras: [],
    best: "You want options. Multiple angles, multiple expressions, enough to actually choose a favorite.",
  },
  {
    name: "The Classic",
    price: 189,
    time: "35 minutes",
    locations: "1-2 locations",
    images: "15 edited digital images",
    extras: ["1 outfit change"],
    popular: true,
    best: "The full grad photo experience. Cap and gown plus your real fit. This is the one most people book.",
  },
  {
    name: "The Experience",
    price: 329,
    time: "60 minutes",
    locations: "2-3 locations",
    images: "30 edited digital images",
    extras: [
      "Multiple outfit changes",
      "Behind-the-scenes phone content for reels/stories",
    ],
    best: "You want the range. Multiple vibes, multiple locations, content you will actually use for months.",
  },
  {
    name: "The Legacy",
    price: 549,
    time: "90 minutes",
    locations: "Full location tour",
    images: "50+ edited digital images",
    extras: [
      "Outfit styling consultation beforehand",
      "Curated highlight reel (15-sec slideshow for socials)",
      "Print-ready high-resolution files included",
    ],
    best: "The definitive graduation shoot. For when this moment deserves the full treatment.",
  },
];

export const DEFAULT_ADDONS: GradAddon[] = [
  { name: "Extra edited images (beyond package count)", price: "$12 / photo" },
  { name: "48-hour rush delivery", price: "+$50" },
  { name: "Print release + high-resolution files", price: "+$35" },
  { name: "Instagram Story mini reel (15-sec slideshow)", price: "+$40" },
  { name: "Second person in the shoot (couples, friends, siblings)", price: "+$60" },
  { name: "Social media resize pack (IG, LinkedIn, FB cover)", price: "+$35" },
  { name: "Phone wallpaper set (3 photos for your lock screen)", price: "+$15" },
];

export const DEFAULT_GALLERY_ITEMS: GradGalleryItem[] = [
  {
    title: "Cap, gown, and the cleanest first frame",
    caption: "Start with the classic portrait so the gallery opens strong and feels immediately premium.",
    location: "Campus architecture",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1600&q=80",
  },
  {
    title: "The in-between shot that still feels like you",
    caption: "A more relaxed frame for the part of the gallery that shows your personality, not just the ceremony.",
    location: "Walkway / courtyard",
    image: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=1600&q=80",
  },
  {
    title: "Friends, family, and the loudest cheer moment",
    caption: "Add a frame like this when you want the scroll to feel more editorial and less repetitive.",
    location: "Support cast shot",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80",
  },
  {
    title: "The dramatic close-up",
    caption: "This is where the motion gallery slows down and gives a hero portrait enough room to breathe.",
    location: "Golden hour close-up",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1600&q=80",
  },
  {
    title: "The final frame with real portfolio energy",
    caption: "Use the last card as the strongest ending shot before the booking CTA kicks in.",
    location: "Final look / signature pose",
    image: "https://images.unsplash.com/photo-1511421133909-6fda7b6f1f79?w=1600&q=80",
  },
];

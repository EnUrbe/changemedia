import type { GradPackage, GradAddon, GradGalleryItem, GradFriendPricing } from "./gradSchema";

export const DEFAULT_PACKAGES: GradPackage[] = [
  {
    name: "The Classic",
    price: 249,
    time: "35 minutes",
    locations: "1–2 locations",
    images: "15 edited images",
    subtitle: "35 minutes · 15 edited images · 1–2 locations · 1 outfit change",
    extras: [
      "35-minute session with direction throughout — you will not be standing there wondering what to do with your hands",
      "1 outfit change",
      "1–2 locations",
      "15 fully edited high-resolution images",
      "Private online gallery delivered within 10 days",
      "Full personal use rights — print, post, and share freely",
    ],
    popular: true,
    best: "Graduates who want a clean, complete set of photos without spending a full afternoon doing it. You know you want good photos. You do not want it to be a whole thing. This is the move.",
    description:
      "The one most people book. Long enough to get comfortable in front of the camera, short enough that you are not overthinking every frame by the end. You show up in your cap and gown, we get those out of the way first, then you change into something that actually looks like you and we shoot the second half of the session in that. One to two locations depending on what is nearby and what the light is doing. You leave with 15 images that are fully edited, high-resolution, and ready to use — for LinkedIn, Instagram, your family group chat, your mom's wall. Not 300 frames you have to sort through. Just 15 that are genuinely good.",
    notIncluded:
      "Video, multiple locations beyond two, additional outfit changes. Those live in The Experience and above.",
  },
  {
    name: "The Experience",
    price: 389,
    time: "60 minutes",
    locations: "2–3 locations",
    images: "30 edited images",
    subtitle: "60 minutes · 30 edited images · 2–3 locations · multiple outfit changes · BTS content",
    extras: [
      "60-minute session with direction throughout",
      "Multiple outfit changes",
      "2–3 locations",
      "30 fully edited high-resolution images",
      "Behind-the-scenes phone content delivered separately for stories and reels",
      "Private online gallery delivered within 10 days",
      "Full personal use rights — print, post, and share freely",
    ],
    best: "Graduates who know they will regret not having more variety. You want options. You want a few different vibes. You want content you will actually use over the next few months, not just one set of shots you post once and move on from.",
    description:
      "Twice the images of The Classic for not much more. That math is intentional. This is the session for graduates who want real variety — different locations, different looks, enough frames to actually have options when the gallery drops instead of settling for whatever turned out okay. An hour is long enough to move between two or three spots, change outfits more than once, and get loose enough in front of the camera that the later frames stop looking like photos and start looking like moments. The behind-the-scenes phone content is shot during natural transitions — location changes, outfit changes, candid in-between moments — and delivered as bonus content for your stories and reels on top of your full edited gallery.",
    notIncluded:
      "The cinematic 4K reel. That lives in The Legacy. The BTS content is phone-shot behind-the-scenes footage, not the cinema-grade reel.",
  },
  {
    name: "The Legacy",
    price: 625,
    time: "90 minutes",
    locations: "Full location tour",
    images: "50+ edited images",
    subtitle: "90 minutes · 50+ edited images · full location tour · outfit styling consult · 4K cinematic vertical reel",
    extras: [
      "Outfit styling consultation before your session",
      "90-minute session with direction throughout",
      "Unlimited outfit changes",
      "Full location tour — you name the spots",
      "50+ fully edited high-resolution images",
      "One 30–60 second 4K cinematic vertical reel, color-graded and music-scored",
      "Private gallery + video file download",
      "Full personal use rights — print, post, and share freely",
    ],
    best: "Graduates who want the full thing. You are not looking for a few decent shots. You want the definitive record of this — something you look back at in ten years and are still glad you did.",
    description:
      "The complete record of this moment. Before your session you get an outfit styling consultation — we talk through what you are bringing, what works on camera, how to coordinate looks across locations so the whole gallery feels cohesive instead of random. On the day we move through a full location tour — campus, parks, wherever means something to you — and shoot across multiple looks with no rushing. The cinematic reel is shot on the Sony FX cinema body, color-graded, cut to music, and delivered vertical. Thirty to sixty seconds of actual motion footage — walking shots, candid moments, intentional cinematic frames — edited into something you will post and keep. Not a slideshow. Not a phone video. A reel that looks like it was made by someone who knows what they are doing, because it was.\n\n50+ images means you will have the full range. Cap and gown, casual, portraits, candid — every version of this day documented in a way that holds up for years.",
    notIncluded:
      "48-hour rush and the champagne reel. Those are available as add-ons or bundled in The Full Send below.",
  },
  {
    name: "The Full Send",
    price: 799,
    time: "90+ minutes",
    locations: "Full location tour",
    images: "50+ edited images",
    subtitle: "Everything in The Legacy + 48-hour rush delivery + champagne reel",
    savesNote: undefined,
    extras: [
      "Everything in The Legacy",
      "48-hour guaranteed gallery delivery",
      "One 15-second 120fps slow-motion champagne reel, color-graded and ready to post",
      "Saves versus booking The Legacy + rush + champagne reel separately",
    ],
    best: "Graduates who know what they want and want all of it. You are not going to look back and wish you had done more. This is the one where you do not have to wish anything.",
    description:
      "The Legacy with two things added that make the whole experience complete.\n\n48-hour rush delivery means your gallery does not sit for ten days. It drops within 48 hours of your session ending. If your ceremony is on a Saturday and you shoot on Thursday, your photos are ready before you walk across the stage. If your family is in town for the weekend you can show them the gallery before they leave. It is a small thing that makes a real difference in the week around graduation.\n\nThe champagne reel is a dedicated 15-second slow-motion clip shot at 120 frames per second — a cap toss, a champagne pop, a celebratory moment captured at a speed that makes it look cinematic. Color-graded separately from your main reel and delivered the same week. The kind of clip that performs well on Instagram and TikTok not because it is trying to, but because it actually looks good.\n\nBooked together as The Full Send you save versus adding them individually to The Legacy. More importantly you walk away from your session with everything — 50+ photos, a full cinematic reel, a slow-motion moment, all of it back in 48 hours. Nothing to wait for. Nothing to add later. Just the complete package from the jump.",
    notIncluded: undefined,
  },
];

export const DEFAULT_ADDONS: GradAddon[] = [
  { name: "Extra edited images (beyond package count)", price: "$12 / photo" },
  { name: "48-hour rush delivery", price: "+$50" },
  { name: "Print release + high-resolution files", price: "+$35" },
  { name: "15-second 120fps slow-motion champagne reel", price: "+$75" },
  { name: "Second person in the shoot (couples, friends, siblings)", price: "+$60" },
  { name: "Social media resize pack (IG, LinkedIn, FB cover)", price: "+$35" },
  { name: "Phone wallpaper set (3 photos for your lock screen)", price: "+$15" },
];

export const DEFAULT_FRIEND_PRICING: GradFriendPricing[] = [
  {
    packageName: "The Classic",
    basePrice: 249,
    plusOne: { total: 349, perPerson: 174, savings: 149 },
    plusTwo: { total: 424, perPerson: 141, savings: 323 },
  },
  {
    packageName: "The Experience",
    basePrice: 389,
    plusOne: { total: 514, perPerson: 257, savings: 264 },
    plusTwo: { total: 589, perPerson: 196, savings: 578 },
  },
  {
    packageName: "The Legacy",
    basePrice: 625,
    plusOne: { total: 775, perPerson: 387, savings: 475 },
    plusTwo: { total: 850, perPerson: 283, savings: 950 },
  },
  {
    packageName: "The Full Send",
    basePrice: 799,
    plusOne: { total: 949, perPerson: 474, savings: 649 },
    plusTwo: { total: 1049, perPerson: 349, savings: 1349 },
  },
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

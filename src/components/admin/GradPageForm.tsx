"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { GradContent } from "@/lib/gradSchema";
import { DEFAULT_PACKAGES, DEFAULT_ADDONS, DEFAULT_GALLERY_ITEMS } from "@/lib/gradDefaults";
import { useRouter } from "next/navigation";
import CloudinaryUploadWidget from "@/components/admin/CloudinaryUploadWidget";

function seedContent(content: GradContent): GradContent {
  return {
    packages: content.packages.length ? content.packages : DEFAULT_PACKAGES,
    addons: content.addons.length ? content.addons : DEFAULT_ADDONS,
    gallery: content.gallery.length ? content.gallery : DEFAULT_GALLERY_ITEMS,
    portfolioGallery: content.portfolioGallery,
    friendPricing: content.friendPricing ?? [],
  };
}

function flattenZodErrors(obj: Record<string, unknown>, prefix = ""): string[] {
  const messages: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key === "_errors" && Array.isArray(value) && value.length > 0) {
      messages.push(prefix ? `${prefix}: ${value.join(", ")}` : String(value[0]));
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const child = prefix
        ? isNaN(Number(key)) ? `${prefix}.${key}` : `${prefix}[${key}]`
        : key;
      messages.push(...flattenZodErrors(value as Record<string, unknown>, child));
    }
  }
  return messages;
}

export default function GradPageForm({ initialContent }: { initialContent: GradContent }) {
  const router = useRouter();
  const [content, setContent] = useState<GradContent>(() => seedContent(initialContent));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/grad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        let detail: string;
        if (errBody?.details && typeof errBody.details === "object") {
          const msgs = flattenZodErrors(errBody.details as Record<string, unknown>);
          detail = msgs.length ? msgs.join(" · ") : "Validation failed";
        } else {
          detail = errBody?.error || "Unknown error";
        }
        throw new Error(detail);
      }
      setMessage("Content saved successfully.");
      router.refresh();
      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      console.error(err);
      setMessage(err instanceof Error ? err.message : "Error saving content.");
    } finally {
      setSaving(false);
    }
  };

  const updateGalleryItem = (index: number, field: string, value: string) => {
    const newItems = [...content.gallery];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, gallery: newItems });
  };

  const updatePortfolioItem = (index: number, field: string, value: string) => {
    const newItems = [...content.portfolioGallery];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, portfolioGallery: newItems });
  };

  const updatePackage = (index: number, field: string, value: string | number | boolean) => {
    const newPackages = [...content.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setContent({ ...content, packages: newPackages });
  };

  const updatePackageExtras = (index: number, value: string) => {
    const newPackages = [...content.packages];
    newPackages[index] = { ...newPackages[index], extras: value.split("\n").filter(v => v.trim()) };
    setContent({ ...content, packages: newPackages });
  };

  const updateAddon = (index: number, field: string, value: string) => {
    const newAddons = [...content.addons];
    newAddons[index] = { ...newAddons[index], [field]: value };
    setContent({ ...content, addons: newAddons });
  };

  const addGalleryItem = () => {
    setContent({
      ...content,
      gallery: [
        ...content.gallery,
        { title: "New Frame", caption: "Caption here", location: "Location", image: "" }
      ]
    });
  };

  const addPortfolioItem = () => {
    setContent({
      ...content,
      portfolioGallery: [
        ...content.portfolioGallery,
        { title: "New Photo", image: "" }
      ]
    });
  };

  const addPackage = () => {
    setContent({
      ...content,
      packages: [
        ...content.packages,
        { name: "New Package", price: 0, time: "1 hour", locations: "1 location", images: "20 photos", extras: [], best: "Best for..." }
      ]
    });
  };

  const addAddon = () => {
    setContent({
      ...content,
      addons: [
        ...content.addons,
        { name: "New Addon", price: "$50" }
      ]
    });
  };

  const removeGalleryItem = (index: number) => {
    setContent({ ...content, gallery: content.gallery.filter((_, i) => i !== index) });
  };

  const removePortfolioItem = (index: number) => {
    setContent({ ...content, portfolioGallery: content.portfolioGallery.filter((_, i) => i !== index) });
  };

  const removePackage = (index: number) => {
    setContent({ ...content, packages: content.packages.filter((_, i) => i !== index) });
  };

  const removeAddon = (index: number) => {
    setContent({ ...content, addons: content.addons.filter((_, i) => i !== index) });
  };

  return (
    <form onSubmit={handleSave} className="space-y-12 pb-24 max-w-5xl">
      
      {/* Packages Section */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif">Packages</h2>
          <Button type="button" onClick={addPackage} variant="ghost" size="md">
            Add Package
          </Button>
        </div>
        <div className="grid gap-6">
          {content.packages.map((pkg, i) => (
            <div key={i} className="p-6 bg-white border border-neutral-200 rounded-xl space-y-4 relative shadow-sm">
              <div className="absolute top-4 right-4">
                <button type="button" onClick={() => removePackage(i)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Package Name</label>
                  <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={pkg.name} onChange={(e) => updatePackage(i, "name", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Price (Number)</label>
                  <input type="number" min="0" className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={pkg.price} onChange={(e) => { const n = e.target.valueAsNumber; updatePackage(i, "price", Number.isFinite(n) ? n : 0); }} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Time / Duration</label>
                  <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={pkg.time} onChange={(e) => updatePackage(i, "time", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Locations</label>
                  <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={pkg.locations} onChange={(e) => updatePackage(i, "locations", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Images Delivered</label>
                  <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={pkg.images} onChange={(e) => updatePackage(i, "images", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Best For (Subtitle)</label>
                  <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={pkg.best} onChange={(e) => updatePackage(i, "best", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Extras (One per line)</label>
                  <textarea className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none h-24" value={pkg.extras.join("\n")} onChange={(e) => updatePackageExtras(i, e.target.value)} />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" id={`popular-${i}`} checked={pkg.popular || false} onChange={(e) => updatePackage(i, "popular", e.target.checked)} className="w-4 h-4 accent-neutral-900" />
                  <label htmlFor={`popular-${i}`} className="text-sm font-medium text-neutral-700 cursor-pointer">Mark as Most Popular</label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Addons Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif">Addons</h2>
          <Button type="button" onClick={addAddon} variant="ghost" size="md">
            Add Addon
          </Button>
        </div>
        <div className="grid gap-6">
          {content.addons.map((addon, i) => (
            <div key={i} className="p-5 bg-white border border-neutral-200 rounded-xl relative shadow-sm flex gap-4 pr-24">
              <div className="absolute top-1/2 -translate-y-1/2 right-4">
                <button type="button" onClick={() => removeAddon(i)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Name</label>
                <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={addon.name} onChange={(e) => updateAddon(i, "name", e.target.value)} />
              </div>
              <div className="w-32">
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Price (Text)</label>
                <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={addon.price} onChange={(e) => updateAddon(i, "price", e.target.value)} placeholder="$50" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Horizontal Strip Gallery Section */}
      <section className="space-y-4 border-t border-neutral-200 pt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif">Horizontal Scroll Strip Gallery</h2>
          <Button type="button" onClick={addGalleryItem} variant="ghost" size="md">
            Add Frame
          </Button>
        </div>
        <div className="grid gap-6">
          {content.gallery.map((item, i) => (
            <div key={i} className="p-6 bg-white border border-neutral-200 rounded-xl space-y-4 relative">
              <div className="absolute top-4 right-4">
                <button type="button" onClick={() => removeGalleryItem(i)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Title</label>
                  <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={item.title} onChange={(e) => updateGalleryItem(i, "title", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Location</label>
                  <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={item.location} onChange={(e) => updateGalleryItem(i, "location", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Caption</label>
                  <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={item.caption} onChange={(e) => updateGalleryItem(i, "caption", e.target.value)} />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Image URL</label>
                  <div className="flex gap-4">
                    <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={item.image} onChange={(e) => updateGalleryItem(i, "image", e.target.value)} placeholder="Image URL..." />
                    <CloudinaryUploadWidget 
                      onUpload={(url: string) => updateGalleryItem(i, 'image', url)}
                    />
                  </div>
                  {item.image && <img src={item.image} alt={item.title} className="w-32 h-32 object-cover rounded-lg border border-neutral-200 mt-2" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif">Standard Portfolio Gallery (Grid)</h2>
          <Button type="button" onClick={addPortfolioItem} variant="ghost" size="md">
            Add Photo
          </Button>
        </div>
        <div className="grid gap-6">
          {content.portfolioGallery.map((item, i) => (
            <div key={i} className="p-6 bg-white border border-neutral-200 rounded-xl space-y-4 relative">
              <div className="absolute top-4 right-4">
                <button type="button" onClick={() => removePortfolioItem(i)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Title / Caption</label>
                  <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={item.title} onChange={(e) => updatePortfolioItem(i, "title", e.target.value)} placeholder="Graduation Portrait" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Image URL</label>
                  <div className="flex gap-4">
                    <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={item.image} onChange={(e) => updatePortfolioItem(i, "image", e.target.value)} placeholder="Image URL..." />
                    <CloudinaryUploadWidget 
                      onUpload={(url: string) => updatePortfolioItem(i, 'image', url)}
                    />
                  </div>
                  {item.image && <img src={item.image} alt={item.title} className="w-32 h-32 object-cover rounded-lg border border-neutral-200 mt-2" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky footer for saving */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-neutral-200 flex items-center justify-between z-50">
        <div className="mx-auto flex gap-4 w-full max-w-xl items-center justify-end">
             {message && <p className={`text-sm font-bold ${message.includes("Error") ? "text-red-600" : "text-green-600"} animate-pulse`}>{message}</p>}
            <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save All Changes"}
            </Button>
        </div>
      </div>
    </form>
  );
}
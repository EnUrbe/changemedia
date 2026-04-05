"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { PhotographyContent } from "@/lib/photographySchema";
import { useRouter } from "next/navigation";
import CloudinaryUploadWidget from "@/components/admin/CloudinaryUploadWidget";

export default function PhotographyPageForm({ initialContent }: { initialContent: PhotographyContent }) {
  const router = useRouter();
  const [content, setContent] = useState<PhotographyContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/photography", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) throw new Error("Failed to save content");
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

  const updateHero = (field: string, value: string) => {
    setContent({ ...content, hero: { ...content.hero, [field]: value } });
  };

  const updatePortfolio = (index: number, field: string, value: string) => {
    const newPort = [...content.portfolio];
    if (field === 'image.src') {
      newPort[index] = { ...newPort[index], image: { ...newPort[index].image, src: value } };
    } else {
      newPort[index] = { ...newPort[index], [field]: value };
    }
    setContent({ ...content, portfolio: newPort });
  };

  const addPortfolio = () => {
    setContent({
      ...content,
      portfolio: [
        ...content.portfolio,
        { id: Date.now().toString(), title: "New Item", category: "Category", image: { src: "" } }
      ]
    });
  };

  const removePortfolio = (index: number) => {
    const newPort = [...content.portfolio];
    newPort.splice(index, 1);
    setContent({ ...content, portfolio: newPort });
  };

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...content.services];
    if (field === 'features') {
      newServices[index] = { ...newServices[index], features: value.split("\n").filter((v: string) => v.trim()) };
    } else {
      newServices[index] = { ...newServices[index], [field]: value };
    }
    setContent({ ...content, services: newServices });
  };

  const addService = () => {
    setContent({
      ...content,
      services: [
        ...content.services,
        { id: Date.now().toString(), numeral: "0" + (content.services.length + 1), title: "New Service", description: "Description here", price: "$0", periodLabel: "Fixed", features: [], buttonLabel: "Select Setup" }
      ]
    });
  };

  const removeService = (index: number) => {
    const newServices = [...content.services];
    newServices.splice(index, 1);
    setContent({ ...content, services: newServices });
  };

  return (
    <form onSubmit={handleSave} className="space-y-12 pb-24 max-w-5xl">
      <section className="space-y-4 pt-4">
        <h2 className="text-2xl font-serif">Hero Section</h2>
        <div className="p-4 sm:p-6 bg-white border border-neutral-200 rounded-xl space-y-4 relative shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Eyebrow</label>
            <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={content.hero.eyebrow} onChange={(e) => updateHero('eyebrow', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Title</label>
            <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={content.hero.title} onChange={(e) => updateHero('title', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Highlight</label>
            <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={content.hero.highlight} onChange={(e) => updateHero('highlight', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Subtitle</label>
            <textarea className="w-full bg-neutral-100 p-2 rounded outline-none h-24 focus:ring-2 ring-neutral-900" value={content.hero.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Availability Info</label>
            <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={content.hero.availability} onChange={(e) => updateHero('availability', e.target.value)} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif">Portfolio Items</h2>
          <Button type="button" onClick={addPortfolio} variant="ghost" size="md">
            Add Field
          </Button>
        </div>
        <div className="grid gap-6">
          {content.portfolio.map((item, i) => (
            <div key={i} className="p-4 sm:p-6 bg-white border border-neutral-200 rounded-xl space-y-4 relative shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="absolute top-4 right-4">
                <button type="button" onClick={() => removePortfolio(i)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
              </div>
              <div className="md:col-span-1 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">ID / Title</label>
                <div className="flex gap-2">
                   <input className="w-1/4 bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" placeholder="id" value={item.id} onChange={(e) => updatePortfolio(i, 'id', e.target.value)} />
                   <input className="flex-1 bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" placeholder="Title" value={item.title} onChange={(e) => updatePortfolio(i, 'title', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 pt-4 md:pt-0 md:mt-0 uppercase tracking-wider text-neutral-500">Category</label>
                <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={item.category} onChange={(e) => updatePortfolio(i, 'category', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Summary (Optional)</label>
                <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={item.summary || ""} onChange={(e) => updatePortfolio(i, 'summary', e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Image Source (URL)</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input className="w-full bg-neutral-100 p-2 rounded focus:ring-2 ring-neutral-900 outline-none" value={item.image?.src || ""} onChange={(e) => updatePortfolio(i, "image.src", e.target.value)} />
                  <CloudinaryUploadWidget 
                    onUpload={(url: string) => updatePortfolio(i, 'image.src', url)}
                  />
                </div>
                {item.image?.src && <img src={item.image.src} alt={item.title} className="w-32 h-32 object-cover rounded-lg border border-neutral-200 mt-2" />}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif">Services / Plans</h2>
          <Button type="button" onClick={addService} variant="ghost" size="md">
            Add Service
          </Button>
        </div>
        <div className="grid gap-6">
          {content.services.map((svc, i) => (
            <div key={i} className="p-4 sm:p-6 bg-white border border-neutral-200 rounded-xl space-y-4 relative shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="absolute top-4 right-4">
                <button type="button" onClick={() => removeService(i)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
              </div>
              <div className="border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">ID / Numeral</label>
                <div className="flex gap-2">
                   <input className="flex-1 bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" placeholder="id" value={svc.id} onChange={(e) => updateService(i, 'id', e.target.value)} />
                   <input className="w-16 bg-neutral-100 p-2 rounded outline-none text-center focus:ring-2 ring-neutral-900" placeholder="01" value={svc.numeral} onChange={(e) => updateService(i, 'numeral', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 pt-4 md:pt-0 uppercase tracking-wider text-neutral-500">Title</label>
                <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={svc.title} onChange={(e) => updateService(i, 'title', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Description</label>
                <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={svc.description} onChange={(e) => updateService(i, 'description', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Price (Text)</label>
                <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" placeholder="$0" value={svc.price} onChange={(e) => updateService(i, 'price', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Period Label</label>
                <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" placeholder="Hourly / Fixed" value={svc.periodLabel} onChange={(e) => updateService(i, 'periodLabel', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Features (One per line)</label>
                <textarea className="w-full bg-neutral-100 p-2 rounded outline-none h-24 focus:ring-2 ring-neutral-900" value={svc.features.join("\n")} onChange={(e) => updateService(i, 'features', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif">Call To Action (Footer)</h2>
        <div className="p-4 sm:p-6 bg-white border border-neutral-200 rounded-xl space-y-4 relative shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Eyebrow</label>
            <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={content.cta.eyebrow} onChange={(e) => setContent({...content, cta: {...content.cta, eyebrow: e.target.value}})} />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Headline</label>
            <input className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={content.cta.headline} onChange={(e) => setContent({...content, cta: {...content.cta, headline: e.target.value}})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-neutral-500">Description</label>
            <textarea className="w-full bg-neutral-100 p-2 rounded outline-none focus:ring-2 ring-neutral-900" value={content.cta.description} onChange={(e) => setContent({...content, cta: {...content.cta, description: e.target.value}})} />
          </div>
        </div>
      </section>

      {/* Sticky footer for saving */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-elevated)] backdrop-blur-md border-t border-[var(--border)] flex items-center justify-between z-50">
        <div className="mx-auto flex gap-4 w-full max-w-xl items-center justify-end">
             {message && <p className={`text-sm font-bold ${message.includes("Error") ? "text-red-500" : "text-[var(--accent)]"} animate-pulse`}>{message}</p>}
            <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save All Changes"}
            </Button>
        </div>
      </div>
    </form>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import CloudinaryUploadWidget from "@/components/admin/CloudinaryUploadWidget";
import type { SiteContent } from "@/lib/contentSchema";

export default function ChangeStudiosForm({ initialContent }: { initialContent: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangeStudios = (field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      changeStudios: {
        ...prev.changeStudios!,
        [field]: value,
      },
    }));
  };

  const handleHeroChange = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      changeStudios: {
        ...prev.changeStudios!,
        hero: {
          ...prev.changeStudios!.hero,
          [field]: value,
        },
      },
    }));
  };

  const handleMarqueeChange = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      changeStudios: {
        ...prev.changeStudios!,
        marquee: {
          ...prev.changeStudios!.marquee,
          [field]: value,
        },
      },
    }));
  };

  const handlePillarChange = (index: number, field: string, value: any) => {
    const newPillars = [...content.changeStudios!.pillars];
    newPillars[index] = { ...newPillars[index], [field]: value };
    handleChangeStudios("pillars", newPillars);
  };

  const handleShowcaseChange = (index: number, field: string, value: any) => {
    const newShowcase = [...content.changeStudios!.showcase];
    newShowcase[index] = { ...newShowcase[index], [field]: value };
    handleChangeStudios("showcase", newShowcase);
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: content, note: "Updated Change Studios content" }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage("Saved successfully!");
      router.refresh();
    } catch (e) {
      setMessage("Error saving content");
    } finally {
      setSaving(false);
    }
  };

  if (!content.changeStudios) return <div>No Change Studios content found.</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center sticky top-0 bg-[#050505] py-4 z-10 border-b border-white/10">
        <h2 className="text-xl font-bold text-white">Edit Content</h2>
        <div className="flex items-center gap-4">
          {message && <span className="text-sm text-emerald-400">{message}</span>}
          <Button onClick={save} disabled={saving} variant="primary">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-white/10 pb-2 text-white">Hero Section</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white/60">Title Line 1</label>
            <input
              className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
              value={content.changeStudios.hero.titleLine1}
              onChange={(e) => handleHeroChange("titleLine1", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white/60">Title Line 2</label>
            <input
              className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
              value={content.changeStudios.hero.titleLine2}
              onChange={(e) => handleHeroChange("titleLine2", e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1 text-white/60">Mission</label>
            <textarea
              className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
              value={content.changeStudios.hero.mission}
              onChange={(e) => handleHeroChange("mission", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white/60">CTA Label</label>
            <input
              className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
              value={content.changeStudios.hero.cta}
              onChange={(e) => handleHeroChange("cta", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-white/10 pb-2 text-white">Marquee</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white/60">Text 1</label>
            <input
              className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
              value={content.changeStudios.marquee.text1}
              onChange={(e) => handleMarqueeChange("text1", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white/60">Text 2</label>
            <input
              className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
              value={content.changeStudios.marquee.text2}
              onChange={(e) => handleMarqueeChange("text2", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-white/10 pb-2 text-white">Pillars</h3>
        {content.changeStudios.pillars.map((pillar, i) => (
          <div key={i} className="p-4 border border-white/10 rounded bg-white/5 space-y-3">
            <h4 className="font-medium text-white">Pillar {i + 1}</h4>
            <div>
              <label className="block text-sm font-medium mb-1 text-white/60">Title</label>
              <input
                className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
                value={pillar.title}
                onChange={(e) => handlePillarChange(i, "title", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white/60">Description</label>
              <textarea
                className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
                value={pillar.desc}
                onChange={(e) => handlePillarChange(i, "desc", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white/60">Tags (comma separated)</label>
              <input
                className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
                value={pillar.tags.join(", ")}
                onChange={(e) => handlePillarChange(i, "tags", e.target.value.split(",").map(s => s.trim()))}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-white/10 pb-2 text-white">Showcase</h3>
        {content.changeStudios.showcase.map((item, i) => (
          <div key={i} className="p-4 border border-white/10 rounded bg-white/5 space-y-3">
            <h4 className="font-medium text-white">Item {i + 1}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white/60">Title</label>
                <input
                  className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
                  value={item.title}
                  onChange={(e) => handleShowcaseChange(i, "title", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white/60">Category</label>
                <input
                  className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
                  value={item.category}
                  onChange={(e) => handleShowcaseChange(i, "category", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white/60">Year</label>
                <input
                  className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
                  value={item.year}
                  onChange={(e) => handleShowcaseChange(i, "year", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white/60">Image URL</label>
                <div className="space-y-2">
                  <input
                    className="w-full p-2 border border-white/10 rounded bg-white/5 text-white focus:outline-none focus:border-white/20"
                    value={item.image}
                    onChange={(e) => handleShowcaseChange(i, "image", e.target.value)}
                  />
                  <CloudinaryUploadWidget 
                    onUpload={(url) => handleShowcaseChange(i, "image", url)} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import CloudinaryUploadWidget from "@/components/admin/CloudinaryUploadWidget";
import type { SiteContent } from "@/lib/contentSchema";
import Image from "next/image";

export default function LandingPageForm({ initialContent }: { initialContent: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleFeaturedChange = (index: number, field: string, value: any) => {
    const newFeatured = [...content.featuredCases];
    newFeatured[index] = { ...newFeatured[index], [field]: value };
    setContent((prev) => ({
      ...prev,
      featuredCases: newFeatured,
    }));
  };

  const addFeaturedCase = () => {
    setContent((prev) => ({
      ...prev,
      featuredCases: [
        ...prev.featuredCases,
        {
          id: `case-${Date.now()}`,
          title: "New Project",
          subtitle: "Description",
          imageUrl: "https://picsum.photos/seed/new/800/600",
          tags: [],
        },
      ],
    }));
  };

  const removeFeaturedCase = (index: number) => {
    const newFeatured = [...content.featuredCases];
    newFeatured.splice(index, 1);
    setContent((prev) => ({
      ...prev,
      featuredCases: newFeatured,
    }));
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: content, note: "Updated Landing Page content" }),
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

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center sticky top-0 bg-[#f6f3ee] py-4 z-10 border-b border-neutral-200">
        <h2 className="text-xl font-bold">Edit Landing Page</h2>
        <div className="flex items-center gap-4">
          {message && <span className="text-sm text-green-600">{message}</span>}
          <Button onClick={save} disabled={saving} variant="primary">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Featured Work (Hero Grid)</h3>
          <Button onClick={addFeaturedCase} variant="soft" size="md">
            + Add Project
          </Button>
        </div>
        
        <p className="text-sm text-neutral-500">
          These images are used in the "Glass Grid" on the hero section and the "Work" slider.
          The first image is also used as the hero background.
        </p>

        <div className="grid gap-8">
          {content.featuredCases.map((item, index) => (
            <div key={item.id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-neutral-900">Project #{index + 1}</h4>
                <button 
                  onClick={() => removeFeaturedCase(index)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleFeaturedChange(index, "title", e.target.value)}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Subtitle / Category</label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => handleFeaturedChange(index, "subtitle", e.target.value)}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.imageUrl}
                        onChange={(e) => handleFeaturedChange(index, "imageUrl", e.target.value)}
                        className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="mt-2">
                      <CloudinaryUploadWidget 
                        onUpload={(url) => handleFeaturedChange(index, "imageUrl", url)} 
                      />
                    </div>
                  </div>
                </div>

                <div className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                  {item.imageUrl ? (
                    <Image 
                      src={item.imageUrl} 
                      alt={item.title} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
                      No image
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

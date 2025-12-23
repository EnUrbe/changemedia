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
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Save error:", errorData);
        throw new Error(errorData.details ? JSON.stringify(errorData.details) : "Failed to save");
      }
      
      setMessage("Saved successfully!");
      router.refresh();
    } catch (e: any) {
      console.error("Save exception:", e);
      setMessage(`Error saving content: ${e.message}`);
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
                      <p className="text-xs text-neutral-400">
                        Click the image preview to upload/change.
                      </p>
                    </div>
                  </div>
                </div>

                <CloudinaryUploadWidget onUpload={(url) => handleFeaturedChange(index, "imageUrl", url)}>
                  <div className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 group cursor-pointer hover:border-neutral-400 transition-all">
                    {item.imageUrl ? (
                      <>
                        <Image 
                          src={item.imageUrl} 
                          alt={item.title} 
                          fill 
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 font-medium bg-black/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            Click to Change
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-neutral-400 text-sm gap-2">
                        <span>No image</span>
                        <span className="text-xs text-neutral-500 bg-neutral-200 px-2 py-1 rounded">Click to Upload</span>
                      </div>
                    )}
                  </div>
                </CloudinaryUploadWidget>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 border-t pt-8">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Gallery Strip</h3>
          <Button onClick={() => {
            setContent(prev => ({
              ...prev,
              galleryCases: [
                ...prev.galleryCases,
                {
                  id: `gallery-${Date.now()}`,
                  title: "New Gallery Item",
                  subtitle: "Category",
                  imageUrl: "https://picsum.photos/seed/gallery/600/400",
                  tags: [],
                }
              ]
            }))
          }} variant="soft" size="md">
            + Add Item
          </Button>
        </div>
        
        <div className="grid gap-8">
          {content.galleryCases.map((item, index) => (
            <div key={item.id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-neutral-900">Gallery Item #{index + 1}</h4>
                <button 
                  onClick={() => {
                    const newGallery = [...content.galleryCases];
                    newGallery.splice(index, 1);
                    setContent(prev => ({ ...prev, galleryCases: newGallery }));
                  }}
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
                      onChange={(e) => {
                        const newGallery = [...content.galleryCases];
                        newGallery[index] = { ...newGallery[index], title: e.target.value };
                        setContent(prev => ({ ...prev, galleryCases: newGallery }));
                      }}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => {
                        const newGallery = [...content.galleryCases];
                        newGallery[index] = { ...newGallery[index], subtitle: e.target.value };
                        setContent(prev => ({ ...prev, galleryCases: newGallery }));
                      }}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.imageUrl}
                        onChange={(e) => {
                          const newGallery = [...content.galleryCases];
                          newGallery[index] = { ...newGallery[index], imageUrl: e.target.value };
                          setContent(prev => ({ ...prev, galleryCases: newGallery }));
                        }}
                        className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-neutral-400">
                        Click the image preview to upload/change.
                      </p>
                    </div>
                  </div>
                </div>

                <CloudinaryUploadWidget 
                  onUpload={(url) => {
                    const newGallery = [...content.galleryCases];
                    newGallery[index] = { ...newGallery[index], imageUrl: url };
                    setContent(prev => ({ ...prev, galleryCases: newGallery }));
                  }}
                >
                  <div className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 group cursor-pointer hover:border-neutral-400 transition-all">
                    {item.imageUrl ? (
                      <>
                        <Image 
                          src={item.imageUrl} 
                          alt={item.title} 
                          fill 
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 font-medium bg-black/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            Click to Change
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-neutral-400 text-sm gap-2">
                        <span>No image</span>
                        <span className="text-xs text-neutral-500 bg-neutral-200 px-2 py-1 rounded">Click to Upload</span>
                      </div>
                    )}
                  </div>
                </CloudinaryUploadWidget>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 border-t pt-8">
        <h3 className="text-lg font-semibold">Logo Cloud</h3>
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Heading</label>
            <input
              type="text"
              value={content.logoCloud.heading}
              onChange={(e) => setContent(prev => ({ ...prev, logoCloud: { ...prev.logoCloud, heading: e.target.value } }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-medium uppercase text-neutral-500">Logos</label>
            {content.logoCloud.logos.map((logo, index) => (
              <div key={index} className="flex gap-4 items-start border p-4 rounded-lg">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Alt Text"
                    value={logo.alt}
                    onChange={(e) => {
                      const newLogos = [...content.logoCloud.logos];
                      newLogos[index] = { ...newLogos[index], alt: e.target.value };
                      setContent(prev => ({ ...prev, logoCloud: { ...prev.logoCloud, logos: newLogos } }));
                    }}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={logo.src}
                      onChange={(e) => {
                        const newLogos = [...content.logoCloud.logos];
                        newLogos[index] = { ...newLogos[index], src: e.target.value };
                        setContent(prev => ({ ...prev, logoCloud: { ...prev.logoCloud, logos: newLogos } }));
                      }}
                      className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <p className="text-xs text-neutral-400">Click logo to upload</p>
                </div>
                <CloudinaryUploadWidget 
                  onUpload={(url) => {
                    const newLogos = [...content.logoCloud.logos];
                    newLogos[index] = { ...newLogos[index], src: url };
                    setContent(prev => ({ ...prev, logoCloud: { ...prev.logoCloud, logos: newLogos } }));
                  }}
                >
                  <div className="relative w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 shrink-0 flex items-center justify-center cursor-pointer hover:border-neutral-400 transition-all group">
                    {logo.src ? (
                      <>
                        <Image 
                          src={logo.src} 
                          alt={logo.alt} 
                          width={80}
                          height={80}
                          className="object-contain max-h-full max-w-full p-2"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <span className="text-xs text-white opacity-0 group-hover:opacity-100 bg-black/50 px-1 rounded">Edit</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-neutral-400">No Logo</span>
                    )}
                  </div>
                </CloudinaryUploadWidget>
                <button 
                  onClick={() => {
                    const newLogos = [...content.logoCloud.logos];
                    newLogos.splice(index, 1);
                    setContent(prev => ({ ...prev, logoCloud: { ...prev.logoCloud, logos: newLogos } }));
                  }}
                  className="text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <Button onClick={() => {
              setContent(prev => ({
                ...prev,
                logoCloud: {
                  ...prev.logoCloud,
                  logos: [...prev.logoCloud.logos, { src: "", alt: "New Logo" }]
                }
              }))
            }} variant="soft" size="md">
              + Add Logo
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-6 border-t pt-8">
        <h3 className="text-lg font-semibold">Testimonials</h3>
        <div className="grid gap-6">
          {content.testimonials.map((t, index) => (
            <div key={t.id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-neutral-900">Testimonial #{index + 1}</h4>
                <button 
                  onClick={() => {
                    const newTestimonials = [...content.testimonials];
                    newTestimonials.splice(index, 1);
                    setContent(prev => ({ ...prev, testimonials: newTestimonials }));
                  }}
                  className="text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => {
                        const newTestimonials = [...content.testimonials];
                        newTestimonials[index] = { ...newTestimonials[index], name: e.target.value };
                        setContent(prev => ({ ...prev, testimonials: newTestimonials }));
                      }}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Role</label>
                    <input
                      type="text"
                      value={t.role}
                      onChange={(e) => {
                        const newTestimonials = [...content.testimonials];
                        newTestimonials[index] = { ...newTestimonials[index], role: e.target.value };
                        setContent(prev => ({ ...prev, testimonials: newTestimonials }));
                      }}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Quote</label>
                    <textarea
                      value={t.quote}
                      onChange={(e) => {
                        const newTestimonials = [...content.testimonials];
                        newTestimonials[index] = { ...newTestimonials[index], quote: e.target.value };
                        setContent(prev => ({ ...prev, testimonials: newTestimonials }));
                      }}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Avatar</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={t.avatar}
                        onChange={(e) => {
                          const newTestimonials = [...content.testimonials];
                          newTestimonials[index] = { ...newTestimonials[index], avatar: e.target.value };
                          setContent(prev => ({ ...prev, testimonials: newTestimonials }));
                        }}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                      />
                      <p className="text-xs text-neutral-400">Click avatar to upload</p>
                    </div>
                    <CloudinaryUploadWidget 
                      onUpload={(url) => {
                        const newTestimonials = [...content.testimonials];
                        newTestimonials[index] = { ...newTestimonials[index], avatar: url };
                        setContent(prev => ({ ...prev, testimonials: newTestimonials }));
                      }}
                    >
                      <div className="relative w-20 h-20 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shrink-0 cursor-pointer hover:border-neutral-400 transition-all group">
                        {t.avatar ? (
                          <>
                            <Image 
                              src={t.avatar} 
                              alt={t.name} 
                              fill 
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <span className="text-xs text-white opacity-0 group-hover:opacity-100 bg-black/50 px-1 rounded">Edit</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-neutral-400 text-xs">No Avatar</div>
                        )}
                      </div>
                    </CloudinaryUploadWidget>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={() => {
            setContent(prev => ({
              ...prev,
              testimonials: [
                ...prev.testimonials,
                {
                  id: `testimonial-${Date.now()}`,
                  name: "New Testimonial",
                  role: "Role",
                  quote: "Quote",
                  avatar: "https://picsum.photos/seed/avatar/200",
                }
              ]
            }))
          }} variant="soft" size="md">
            + Add Testimonial
          </Button>
        </div>
      </section>

      <section className="space-y-6 border-t pt-8">
        <h3 className="text-lg font-semibold">SEO Settings</h3>
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Site Title</label>
            <input
              type="text"
              value={content.seo.title}
              onChange={(e) => setContent(prev => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">Description</label>
            <textarea
              value={content.seo.description}
              onChange={(e) => setContent(prev => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase text-neutral-500 mb-1">OG Image (Social Share)</label>
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={content.seo.ogImage}
                  onChange={(e) => setContent(prev => ({ ...prev, seo: { ...prev.seo, ogImage: e.target.value } }))}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                />
                <p className="text-xs text-neutral-400">Click preview to upload</p>
              </div>
              <CloudinaryUploadWidget 
                onUpload={(url) => setContent(prev => ({ ...prev, seo: { ...prev.seo, ogImage: url } }))} 
              >
                <div className="relative w-40 aspect-[1.91/1] bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 shrink-0 cursor-pointer hover:border-neutral-400 transition-all group">
                  {content.seo.ogImage ? (
                    <>
                      <Image 
                        src={content.seo.ogImage} 
                        alt="OG Image" 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="text-xs text-white opacity-0 group-hover:opacity-100 bg-black/50 px-1 rounded">Edit</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400 text-xs">No Image</div>
                  )}
                </div>
              </CloudinaryUploadWidget>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

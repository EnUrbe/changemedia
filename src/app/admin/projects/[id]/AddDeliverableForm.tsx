"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { addDeliverable } from "../actions";
import CloudinaryUploadWidget from "@/components/admin/CloudinaryUploadWidget";

export default function AddDeliverableForm({ projectId }: { projectId: string }) {
  const [images, setImages] = useState("");

  const handleUpload = (url: string) => {
    setImages((prev) => (prev ? `${prev}, ${url}` : url));
  };

  return (
    <form 
      action={async (formData) => {
        await addDeliverable(projectId, formData);
      }} 
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-neutral-700">Title</label>
        <input name="title" required className="w-full rounded-lg border border-neutral-200 px-3 py-2" placeholder="Final Gallery" />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700">Type</label>
        <select name="type" className="w-full rounded-lg border border-neutral-200 px-3 py-2">
          <option value="gallery">Gallery</option>
          <option value="video">Video</option>
          <option value="podcast">Podcast</option>
          <option value="portrait">Portrait</option>
          <option value="photoshoot">Photoshoot</option>
          <option value="document">Document</option>
          <option value="link">Link</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">Main URL</label>
        <input name="url" required className="w-full rounded-lg border border-neutral-200 px-3 py-2" placeholder="https://..." />
        <p className="text-xs text-neutral-500">For galleries, this can be the folder URL or a cover image.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">Images (Comma separated URLs)</label>
        <div className="mb-2">
           <CloudinaryUploadWidget onUpload={handleUpload} />
        </div>
        <textarea 
          name="images" 
          className="w-full rounded-lg border border-neutral-200 px-3 py-2" 
          rows={3} 
          placeholder="https://..., https://..." 
          value={images}
          onChange={(e) => setImages(e.target.value)}
        />
        <p className="text-xs text-neutral-500">Only for Gallery type.</p>
      </div>

      <Button type="submit" fullWidth>Add Deliverable</Button>
    </form>
  );
}

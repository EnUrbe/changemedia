"use client";

import { useRef, useEffect, useState } from "react";
import Script from "next/script";
import Button from "@/components/ui/Button";

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function CloudinaryUploadWidget({ onUpload, children }: CloudinaryUploadWidgetProps) {
  const [loaded, setLoaded] = useState(false);
  const widgetRef = useRef<any>(null);
  const onUploadRef = useRef(onUpload);

  useEffect(() => {
    onUploadRef.current = onUpload;
  }, [onUpload]);

  useEffect(() => {
    if (window.cloudinary) {
      setLoaded(true);
    }
  }, []);

  const openWidget = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!loaded || !window.cloudinary) {
      console.warn("Cloudinary script not loaded yet");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Missing Cloudinary configuration", { cloudName, uploadPreset });
      alert("Cloudinary configuration missing. Check console for details.");
      return;
    }

    // Create a new widget instance each time to avoid state issues
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "url", "camera"], // Removed google_drive to reduce complexity/potential hangs
        multiple: false,
        clientAllowedFormats: ["image", "video"],
        maxImageFileSize: 10000000, // 10MB
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log("Upload success:", result.info.secure_url);
          onUploadRef.current(result.info.secure_url);
        }
        if (error) {
          console.error("Cloudinary widget error:", error);
        }
      }
    );
    
    widget.open();
  };

  return (
    <>
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        onLoad={() => setLoaded(true)}
        onError={(e) => console.error("Cloudinary script failed to load", e)}
      />
      {children ? (
        <div onClick={openWidget} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button type="button" variant="soft" onClick={openWidget} className="w-full" disabled={!loaded}>
          {loaded ? "Upload Photos via Cloudinary" : "Loading Uploader..."}
        </Button>
      )}
    </>
  );
}

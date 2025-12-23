"use client";

import { useRef, useCallback } from "react";
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
  const widgetRef = useRef<any>(null);

  const openWidget = useCallback(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url", "camera", "google_drive"],
          multiple: false,
          clientAllowedFormats: ["image", "video"],
          maxImageFileSize: 10000000, // 10MB
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            console.log("Upload success:", result.info.secure_url);
            onUpload(result.info.secure_url);
          }
        }
      );
      widgetRef.current.open();
    }
  }, [onUpload]);

  return (
    <>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" onLoad={() => {}} />
      {children ? (
        <div onClick={openWidget} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button type="button" variant="soft" onClick={openWidget} className="w-full">
          Upload Photos via Cloudinary
        </Button>
      )}
    </>
  );
}

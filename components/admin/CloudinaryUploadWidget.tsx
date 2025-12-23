"use client";

import { useRef, useEffect, useCallback } from "react";
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
  const onUploadRef = useRef(onUpload);

  // Keep the callback ref up to date so we don't need to recreate the widget
  useEffect(() => {
    onUploadRef.current = onUpload;
  }, [onUpload]);

  const openWidget = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (widgetRef.current) {
      widgetRef.current.open();
      return;
    }

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
            onUploadRef.current(result.info.secure_url);
          }
        }
      );
      widgetRef.current.open();
    } else {
      console.error("Cloudinary script not loaded yet");
      alert("Upload widget is still loading, please try again in a moment.");
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetRef.current) {
        // Some widget implementations might have a destroy method, 
        // but Cloudinary's widget usually just needs to be let go.
        // We can set it to null to be safe.
        widgetRef.current = null;
      }
    };
  }, []);

  return (
    <>
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

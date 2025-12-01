"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface GlassGridProps {
  images: string[];
}

export default function GlassGrid({ images }: GlassGridProps) {
  // Ensure we have exactly 8 slots, filling with placeholders if needed
  const displayImages = [...images];
  while (displayImages.length < 8) {
    displayImages.push(images[0] || "https://picsum.photos/seed/fallback/200");
  }
  
  return (
    <div className="relative p-4 md:p-6 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl w-fit mx-auto md:mx-0">
      <div className="grid grid-cols-4 gap-4 md:gap-6">
        {displayImages.slice(0, 8).map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-neutral-800/50 shadow-lg ring-1 ring-white/10"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 80px, 112px"
            />
          </motion.div>
        ))}
      </div>
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

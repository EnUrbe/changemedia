"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Button from "./Button";

interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
}

interface ShowcaseSliderProps {
  items: ShowcaseItem[];
}

export default function ShowcaseSlider({ items }: ShowcaseSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden py-12">
      <motion.div 
        className="flex gap-8 px-4 md:px-8"
        style={{ x }}
      >
        {items.map((item) => (
          <div 
            key={item.id} 
            className="group relative h-[60vh] min-w-[80vw] md:min-w-[40vw] overflow-hidden rounded-2xl bg-neutral-900 border border-white/10"
          >
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
               <Image
                 src={item.image}
                 alt={item.title}
                 fill
                 className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-8 z-20">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-mono text-neutral-400 mb-2 uppercase tracking-widest">{item.category} — {item.year}</p>
                  <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">{item.title}</h3>
                  <Button variant="ghost" className="text-sm">View Project</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

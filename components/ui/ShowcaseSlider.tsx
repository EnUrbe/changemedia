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
    <div ref={containerRef} className="w-full overflow-hidden">
      <motion.div 
        className="flex divide-x divide-border-soft border-l border-border-soft"
        style={{ x }}
      >
        {items.map((item) => (
          <div 
            key={item.id} 
            className="group relative h-[60vh] min-w-[300px] md:min-w-[400px] bg-surface overflow-hidden first:border-l border-r border-border-strong"
          >
            <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700">
               <Image
                 src={item.image}
                 alt={item.title}
                 fill
                 className="object-cover"
               />
               <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-background/90 border-t border-border-strong translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-mono text-brand-accent mb-2 uppercase tracking-widest">{item.category} — {item.year}</p>
                  <h3 className="font-serif text-2xl text-foreground">{item.title}</h3>
                </div>
                <span className="text-2xl">→</span>
              </div>
            </div>
            
            {/* Always visible title overlay if preferred, but sliding panel is nice interaction */}
            <div className="absolute top-6 left-6 z-20 mix-blend-difference text-white pointer-events-none">
               <span className="font-mono text-xs border border-white/50 px-2 py-1">{item.category}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
